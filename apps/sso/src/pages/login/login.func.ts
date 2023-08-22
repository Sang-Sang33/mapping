import Cookies from "js-cookie";
import { ComputedValue } from "mobx/dist/internal";

export const ipReg = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/;
export const isIp =
  ipReg.test(window.location.host) ||
  window.location.host.includes("localhost");

export const getTenant = (url: string | null) => {
  if (!url) return "";
  //   let url = window.location.href;
  //   let protocol = window.location.protocol + "//";
  if (url.indexOf("https://") > -1) {
    url = url.replace("https://", "");
  }
  if (url.indexOf("http://") > -1) {
    url = url.replace("http://", "");
  }
  let except_params = window.EXCEPT_PARAMS || "www";
  //   url = url.replace(protocol, "");

  //   console.log("查看location的区别", window.location);
  //   www.dev.multiway-cloud.com
  //   www.multiway-cloud.com
  //   dev.multiway-cloud.com

  console.log("localhost", url.indexOf("localhost") == -1);
  console.log("127.0.0.1", url.indexOf("127.0.0.1") == -1);

  console.log("是否是ip->是否获取租户", isIp);
  // 这种方式比之前得要好，在有ip的情况下找multiway-cloud的位置，然后找前一个位置
  //   if (!isIp) {
  //     const urlAry = url.split("."),
  //       index = urlAry.indexOf("multiway-cloud");
  //     if (index > 0) {
  //       return urlAry[index - 1] === except_params ? "" : urlAry[index - 1];
  //     }
  //   }

  if (!isIp) {
    // 如果不是ip访问的，则找url上第一个不为www的值，
    const urlAry = url.split(".");
    if (urlAry[0] && urlAry[0] != except_params && urlAry[0] != url) {
      return urlAry[0];
    }
  }
  return "";
};

/**
 * 获取当前 URL 二级域名
 * 如果当前是 IP 地址，则直接返回 IP Address
 */
function getSubdomain() {
  try {
    let subdomain = "";
    const { domain } = document;
    const domainList = domain.split(".");
    console.log("domain", domain, domainList);

    const ipAddressReg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    // 若为 IP 地址、localhost，则直接返回
    if (ipAddressReg.test(domain) || domain === "localhost") {
      return domain;
    }

    return domain;

    const urlItems = [];
    // 拿到顶级域名
    urlItems.unshift(domainList.pop());
    console.log("urlItems", urlItems, domainList);

    // 如果有则执行一次,添加二级域名
    if (domainList.length) {
      urlItems.unshift(domainList.pop());
    }

    // 如果有则执行一次,添加三级域名
    if (domainList.length) {
      urlItems.unshift(domainList.pop());
    }

    subdomain = urlItems.join(".");

    return subdomain || document.domain;
  } catch (e) {
    return document.domain;
  }
}
console.log("[获取到的二级域名]", getSubdomain());
export const setLoginCookie = (key: string, value: any) => {
  console.log("setLoginCookie", isIp);

  Cookies.set(key, value, {
    expires: 365,
    // domain: isIp ? "" : getSubdomain() || import.meta.env.VITE_DOMAIN,
  });
};

export const deleteLoginCookie = (key: string) => {
  Cookies.remove(key, {
    // domain: isIp ? "" : getSubdomain() || import.meta.env.VITE_DOMAIN,
  });
};

export const loadIFrame = (url: string, callback: any) => {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", url);
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.onload = function () {
    if (typeof callback === "function") {
      callback();
    }
  };
};
