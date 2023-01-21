import { Catalogue } from './catalogue';
import { LocalCatalogue } from './localCatalogue';
export interface Artist {
  id: string,
  name: string;
  musicbrainzId?: string;
  catalogue?: Catalogue[];
  lastUpdate?: string;
  localCatalogue?: LocalCatalogue;
  localCatalogueCount?: number;
}
