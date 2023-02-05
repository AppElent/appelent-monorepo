import GitHubAPI from "./GitHubAPI";

const token = process.env.GITHUB_TOKEN;
export const github = new GitHubAPI(token);

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      // ... handle GET request
      break;
    case "POST":
      // ... handle POST request
      break;
    case "PATCH":
      // ... handle PATCH request
      break;
    case "DELETE":
      // ... handle DELETE request
      break;
    default:
      res.status(405).end();
      break;
  }
}
