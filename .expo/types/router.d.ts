/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/assessment`; params?: Router.UnknownInputParams; } | { pathname: `/full-report`; params?: Router.UnknownInputParams; } | { pathname: `/idea`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/paywall`; params?: Router.UnknownInputParams; } | { pathname: `/result`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/assessment`; params?: Router.UnknownOutputParams; } | { pathname: `/full-report`; params?: Router.UnknownOutputParams; } | { pathname: `/idea`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/paywall`; params?: Router.UnknownOutputParams; } | { pathname: `/result`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/assessment${`?${string}` | `#${string}` | ''}` | `/full-report${`?${string}` | `#${string}` | ''}` | `/idea${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/paywall${`?${string}` | `#${string}` | ''}` | `/result${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/assessment`; params?: Router.UnknownInputParams; } | { pathname: `/full-report`; params?: Router.UnknownInputParams; } | { pathname: `/idea`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/paywall`; params?: Router.UnknownInputParams; } | { pathname: `/result`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
