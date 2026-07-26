import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: "{itemLabel} becomes prime minister of Lithuania",
  },
  dirPath: import.meta.dir,
  id: "lithuanian-prime-ministers-taking-office",
  minScore: 31,
  title: "Lithuanian Prime Ministers Taking Office",
});
