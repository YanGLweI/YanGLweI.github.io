const GITHUB_API_BASE = 'https://api.github.com';
const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'YanGLweI';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: 'application/vnd.github.v3+json',
};

if (TOKEN) {
  headers.Authorization = `token ${TOKEN}`;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionsCollection {
  weeks: ContributionWeek[];
}

async function fetchFromGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
}

export async function getUserProfile(): Promise<GitHubUser> {
  return fetchFromGitHub(`/users/${USERNAME}`);
}

export async function getUserRepos(): Promise<GitHubRepo[]> {
  const repos = await fetchFromGitHub<GitHubRepo[]>(
    `/users/${USERNAME}/repos?sort=updated&per_page=100`
  );
  // Filter out forks and sort by stars
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
}

export async function getContributions(): Promise<ContributionDay[]> {
  // Using GitHub GraphQL API for contributions
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username: USERNAME },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    console.error('GraphQL errors:', data.errors);
    throw new Error(data.errors[0]?.message || 'GraphQL error');
  }

  const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  return weeks.flatMap((week: ContributionWeek) => week.contributionDays);
}
