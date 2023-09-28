using Bootsharp;
using Naninovel.Bindings;
using Naninovel.Language;
using static Naninovel.Bindings.Utilities;

[assembly: JSNamespace(NamespacePattern, NamespaceReplacement)]

JSLogger.LogInfo($"Naninovel language version: {typeof(Language).Assembly.GetName().Version}");
