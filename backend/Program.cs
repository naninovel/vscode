using Bootsharp;
using Naninovel.Bindings;
using Naninovel.Language.Bindings;

[assembly: JSPreferences(Space = [Space.Pattern, Space.Replacement])]

Bridging.BreakConnectionLoop(); // Hack over .NET bug where it otherwise fails to init Bridging type.
JSLogger.LogInfo($"Naninovel language version: {typeof(Language).Assembly.GetName().Version}");
