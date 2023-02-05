import axios from "axios";

class GitHubAPI {
  static baseURL = "https://api.github.com";

  constructor(token) {
    this.token = token;
  }

  async createIssue(owner, repo, issue) {
    try {
      const response = await axios.post(
        `${GitHubAPI.baseURL}/repos/${owner}/${repo}/issues`,
        issue,
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateIssue(owner, repo, issueNumber, issue) {
    try {
      const response = await axios.patch(
        `${GitHubAPI.baseURL}/repos/${owner}/${repo}/issues/${issueNumber}`,
        issue,
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteIssue(owner, repo, issueNumber) {
    try {
      const response = await axios.delete(
        `${GitHubAPI.baseURL}/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      throw error;
    }
  }
}

export default GitHubAPI;
