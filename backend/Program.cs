using Bootsharp;
using Naninovel.Bindings;
using Naninovel.Language;

[assembly: JSPreferences(Space = [Space.Pattern, Space.Replacement])]

JSLogger.LogInfo($"Naninovel language version: {typeof(Language).Assembly.GetName().Version}");
