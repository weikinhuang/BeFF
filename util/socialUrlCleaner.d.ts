interface SocialServices {
  [service: string]: {
    domain: string;
    prefix: string;
    [k: string]: any;
  };
}

export default function socialUrlCleaner(services: SocialServices, url: string, service: string): string;
