const baseUrl: string = "https://github.com/";

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
  } catch (error) {
    console.log(error);
  }
}

getGithubInfo("Moyhuai");
