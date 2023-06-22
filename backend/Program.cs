using System.Text.Json.Serialization;
using DotNetJS;
using Naninovel.Bindings;
using static Naninovel.Bindings.Utilities;

[assembly: JSNamespace(NamespacePattern, NamespaceReplacement)]

namespace Naninovel.Language.VSCode;

public static class Program
{
    static Program ()
    {
        JS.Runtime.ConfigureJson(options =>
            options.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        );
    }

    public static void Main ()
    {
        JSLogger.LogInfo($"Naninovel language version: {typeof(Language).Assembly.GetName().Version}");
    }
}
