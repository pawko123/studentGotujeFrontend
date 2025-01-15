/**
 * Represents a tag that can be associated with various entities.
 * 
 * @interface Tag
 * @property {number} id - The unique identifier for the tag.
 * @property {string} name - The name of the tag.
 * @property {string} tagType - The type or category of the tag.
 */
interface Tag {
    id: number;
    name: string;
    tagType: string;
}

export default Tag;