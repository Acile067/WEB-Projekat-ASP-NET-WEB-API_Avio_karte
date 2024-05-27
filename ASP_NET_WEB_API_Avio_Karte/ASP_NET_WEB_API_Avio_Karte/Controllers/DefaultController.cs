using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class DefaultController : ApiController
    {
        [HttpGet, Route("")]
        public RedirectResult Index()
        {
            return Redirect(Request.RequestUri.AbsoluteUri + "MyPages\\index.html");
        }
    }
}
