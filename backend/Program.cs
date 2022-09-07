using DotNetJS;
using static Naninovel.Common.Bindings.Utilities;

[assembly: JSNamespace(NamespacePattern, NamespaceReplacement)]

namespace Naninovel.VSCode.WASM;

public static class Program
{
    static Program () => ConfigureJson();

    public static void Main ()
    {
        // https://github.com/Elringus/DotNetJS/issues/23
        _ = typeof(Naninovel.Language.Bindings.Language.Language).Assembly;
        var languageAssembly = typeof(Language.Document).Assembly;
        Log($"Naninovel language version: {languageAssembly.GetName().Version}");
    }
}
