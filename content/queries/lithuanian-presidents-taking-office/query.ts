import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: "{itemLabel} becomes president of Lithuania",
  },
  dirPath: import.meta.dir,
  id: "lithuanian-presidents-taking-office",
  minScore: 31,
  title: "Lithuanian Presidents Taking Office",
});
