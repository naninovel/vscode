using DotNetJS;
using static Naninovel.Common.Bindings.Utilities;

[assembly: JSNamespace(NamespacePattern, NamespaceReplacement)]

namespace Bindings;

public static class Program
{
    static Program () => ConfigureJson();

    public static void Main () { }
}
