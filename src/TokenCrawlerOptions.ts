import CrawlerOptions from './CrawlerOptions';

export class TokenCrawlerOptions extends CrawlerOptions {
  public readonly interactedAddress: string;
  public readonly investigatedAddress: string[];
}

export default TokenCrawlerOptions;
