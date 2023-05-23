using DotNetJS;
using Naninovel.Bindings;
using static Naninovel.Bindings.Utilities;

[assembly: JSNamespace(NamespacePattern, NamespaceReplacement)]

namespace Naninovel.Language.VSCode;

public static class Program
{
    public static void Main ()
    {
        JSLogger.LogInfo($"Naninovel language version: {typeof(Language).Assembly.GetName().Version}");
    }
}
