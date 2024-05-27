using System.Web;
using System.Web.Mvc;

namespace ASP_NET_WEB_API_Avio_Karte
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
