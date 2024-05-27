using System;
using System.Reflection;

namespace ASP_NET_WEB_API_Avio_Karte.Areas.HelpPage.ModelDescriptions
{
    public interface IModelDocumentationProvider
    {
        string GetDocumentation(MemberInfo member);

        string GetDocumentation(Type type);
    }
}