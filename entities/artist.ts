import { Catalogue } from './catalogue';
import { Wikipedia } from './wikipedia';
import { ArtistUrl } from './artistUrl';
import { LocalCatalogue } from './localCatalogue';
export interface Artist {
  id: string;
  name: string;
  musicbrainzId?: string;
  catalogue?: Catalogue[];
  urls?: ArtistUrl[];
  wikipedia?: Wikipedia;
  lastUpdate?: string;
  localCatalogue?: LocalCatalogue;
  localCatalogueCount?: number;
}
