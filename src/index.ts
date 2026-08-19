const baseUrl: string = "https://github.com/";

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

/**
 * 提取仓库名称
 *
 * @param data HTML字符串数组
 * @returns 仓库名称数组
 */
function getRepoList(data: string[]): (string | undefined)[] {
  // ---------------提取仓库名称-----------------
  const list: string[] = [];
  data.forEach((item) => {
    if (item.includes('itemprop="name codeRepository"')) {
      list.push(item);
    }
  });

  const arr: (string | undefined)[] = list.map(
    (item) => item.trim().split(" ")[1],
  );

  const repoList: (string | undefined)[] = arr.map((item) => {
    if (item) {
      return item.slice(item.lastIndexOf("/") + 1);
    }
  });
  return repoList;
}

async function getGithubInfo(
  author: string,
): Promise<(string | undefined)[] | undefined> {
  try {
    const result: Response = await fetch(
      baseUrl + author + "?tab=repositories",
      {
        signal: controller.signal,
      },
    );

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    //-------------------解析HTML-----------------
    const htmlstr: string = await result.text();
    const data: string[] = htmlstr.split("\n");

    const repoList: (string | undefined)[] = getRepoList(data);

    //-------------------获取star数-----------------
    const list: (string | undefined)[] = [];
    data.forEach((item) => {
      if (item.includes(`href=\"/${author}/`)) {
        list.push(item);
      }
    });
    console.log(list);

    return repoList;
  } catch (error) {
    console.log(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

getGithubInfo("Moyhuai");
