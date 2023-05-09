import plugin from "../plugin.json";


class AcodePlugin {
  async init() {
    this.run = this.run.bind(this);

    this.#commands.forEach((command) => {
      editorManager.editor.commands.addCommand(command);
    });
  }

  async run() {
    try {
      const response = await fetch(
        "https://jaspervdj.be/lorem-markdownum/markdown.txt"
      );
      const text = await response.text();
      editorManager.editor.insert(text);
    } catch (e) {
      return;
    }
  }

  async destroy() {
    this.#commands.forEach((command) => {
      editorManager.editor.commands.removeCommand(command);
    });
  }

  get #commands() {
    return [
      {
        name: "loremmarkdown",
        description: "LoremMarkdown",
        exec: this.run.bind(this),
      },
      {
        name: "markdownlorem",
        description: "MarkdownLoremIpsum",
        exec: this.run.bind(this),
      },
    ];
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(
    plugin.id,
    (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      acodePlugin.init($page, cacheFile, cacheFileUrl);
    }
  );
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
