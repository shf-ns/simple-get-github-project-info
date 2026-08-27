const baseUrl: string = "https://github.com/";

/**
 * 处理HTML字符串，提取包含所需信息的HTML部分
 * @param {string} htmlstr HTML字符串
 * @returns {string[][]}包含所有所需信息的HTML部分数组
 */
function handleHtml(htmlstr: string): string[][] {
  //----------截取包含所需信息的HTML部分-------------
  const results: string[] = [];
  let startIndex: number = 0;

  while (startIndex < htmlstr.length) {
    //找头部
    const headStart: number = htmlstr.indexOf(
      '<div class="col-10 col-lg-9 d-inline-block">',
      startIndex,
    );
    if (headStart === -1) break;

    //找尾部（从头部结束位置之后开始找，防止重叠）
    const tailStrat: number =
      headStart + '<div class="col-10 col-lg-9 d-inline-block">'.length;
    const tailEnd: number = htmlstr.indexOf("</relative-time>", tailStrat);
    if (tailEnd === -1) break;

    //截取
    results.push(htmlstr.substring(headStart, tailEnd));

    //移动指针，继续找下一处
    startIndex = tailEnd + "</relative-time>".length;
  }

  const list: string[][] = results.map((item) =>
    item
      .split("\n")
      .map((item) => item.trim())
      .filter(
        (item) =>
          item !== "" &&
          item !== "</h3>" &&
          item !== "</div>" &&
          item !== "</span>" &&
          item !== "</relative-time>" &&
          item !== "</a>" &&
          item !== "</svg>" &&
          item !== "</p>",
      ),
  );
  return list;
}

async function getGithubInfo(author: string): Promise<void> {
  try {
    const result: Response = await fetch(
      baseUrl + author + "?tab=repositories",
    );

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    //-------------------解析HTML-----------------
    const htmlstr: string = await result.text();

    //----------处理HTML字符串-------------
    const list: string[][] = handleHtml(htmlstr);

    //----------获取仓库列表-------------
    const repoList: string[] = list.map((item) => item[4]?.slice(0, -4) || "");

    //----------获取语言列表-------------
    const langList: string[][] = list.map((item) =>
      item
        .map((items) => {
          if (items.includes('itemprop="programmingLanguage"')) {
            return items;
          }
          return "";
        })
        .filter((item) => item !== "")
        .map((i) => i.slice(37, -7)),
    );
  } catch (error) {
    console.log(error);
  }
}

// getGithubInfo("Moyhuai");
getGithubInfo("Roy-Jin");
