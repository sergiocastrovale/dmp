import { Catalogue } from './catalogue';
import { Wikipedia } from './wikipedia';
import { ArtistUrl } from './artistUrl';
import { LocalCatalogue } from './localCatalogue';
export interface Artist {
  id: string;
  name: string;
  musicbrainzId?: string;
  urls?: ArtistUrl[];
  wikipedia?: Wikipedia;
  lastUpdate?: string;
  localCatalogueCount?: number;
  catalogue?: Catalogue[];
  localCatalogue?: LocalCatalogue;
}
