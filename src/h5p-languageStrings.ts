import * as jszip from 'jszip';

import { H5pContent } from './models/h5p-content';

/**
 * Manages the string that are displayed to the user in an h5p library and configurable in the editor.
 */
export class H5pLanguageStrings {
  private constructor(private semantics: object, private languageFile = null) {

  }

  /**
   * Creates a H5pLanguageStrings object by opening a library in the H5P package.
   * @param h5pPackage - the zip package containing the library
   * @param libraryName - the full name of the library (e.g. H5P.Flashcards)
   * @param majorVersion - e.g. 1
   * @param minorVersion - e.g 0
   * @param languageCode - the language code as used in h5p (e.g. en, de, fr).
   * @returns library 
   */
  public static async fromLibrary(h5pPackage: jszip, libraryName: string, majorVersion: number, minorVersion: number, languageCode: string = "en"): Promise<H5pLanguageStrings> {
    let libraryDirectory = `${libraryName}-${majorVersion}.${minorVersion}`;
    let semanticsEntry = await h5pPackage.file(libraryDirectory + '/semantics.json').async("text");

    let langObject: object = null;
    if (languageCode !== "en") {
      let langEntry = await h5pPackage.file(libraryDirectory + `/language/${languageCode}.json`).async("text");
      langObject = JSON.parse(langEntry);
    }
    return new H5pLanguageStrings(JSON.parse(semanticsEntry), langObject);
  }

  /**
   * Gets language strings
   * @param name The name of the string.
   * @returns The string in the language this object was initialized with.
   */
  public get(name: string) {
    for (let key in this.semantics) {
      if (this.semantics[key]['name'] === undefined || this.semantics[key]['name'] !== name)
        continue;
      if (this.languageFile === null || this.languageFile.semantics[key]['default'] === undefined) {
        return this.semantics[key]['default'];
      }
      else {
        return this.languageFile.semantics[key]['default'];
      }
    }
  }

  /**
   * Gets alls language strings
   * @returns language strings including their name and value
   */
  public getAll(): { name: string, value: string }[] {
    let list: { name: string, value: string }[] = new Array();

    for (let key in this.semantics) {
      if (this.semantics[key]['name'] !== undefined && this.semantics[key]['common'] === true) {
        list.push({ name: this.semantics[key]['name'], value: this.get(this.semantics[key]['name']) });
      }
    }

    return list;
  }

  /**
   * Adds all language strings as properties to the object
   * @param content 
   */
  public addAllToContent(content: H5pContent) {
    let commonStrings = this.getAll();
    for (let str of commonStrings) {
      if (content[str.name] !== undefined)
        continue;
      content[str.name] = str.value;
    }
  }
}
