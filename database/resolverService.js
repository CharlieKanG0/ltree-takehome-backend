import { UserInputError } from 'apollo-server';
import { Low, JSONFile, LowSync, JSONFileSync } from 'lowdb';
import { nanoid } from 'nanoid';
const MAX_LENGTH = 144;

export const initContext = () => {
    const db = new LowSync(new JSONFileSync('database/db.json'));
    db.read();
    const { users, links } = db.data;

    return {
        UserService: userService(users),
        LinkService: linkService(links),
        DbContext: db,
    };
};

// Resolver service
const userService = (users) => {
    const allUsers = () => users;
    const userByUserId = ({ id }) => users.find(u => u.id === id);
  
    return { userByUserId, allUsers };
}; 

const linkService = (links) => {
    // Query
    const allLinks = () => links;
    const linkByLinkId = ({ id }) => links.find(l => l.id === id);
    const linksByUserId = ({ id, sortByDateAscending }) => {
        const filteredLinks = links.filter(l => l.userId === id);
        if (sortByDateAscending === undefined) return filteredLinks;

        if (!!sortByDateAscending) {
            return filteredLinks.sort((a,b) => a.createdDateTime - b.createdDateTime);
        } else {
            return filteredLinks.sort((a,b) => b.createdDateTime - a.createdDateTime);
        }
    }
  
    // Mutation
    const addClassicLink = ({ classicLinkInput, db }) => {
        // @TODO
        // option 1: create an independant validation service to handle all validation logics
        // option 2: add validation to schema directives using graphql-constraint-directive
        if (classicLinkInput.title.length > MAX_LENGTH) {
            throw new UserInputError(`title lengths must be less than ${MAX_LENGTH}`)
        }

        const newClassicLink = {
            id: nanoid(),
            createdDateTime: Date.now().toString(),
            ...classicLinkInput 
        }
  
        links.push(newClassicLink);
        db.write();
        return newClassicLink;
    };

    const addShowLink = ({ showLinkInput, db }) => {        
        const newShowLink = {
            id: nanoid(),
            createdDateTime: Date.now().toString(),
            ...showLinkInput 
        }
  
        links.push(newShowLink);
        db.write();
        return newShowLink;
    };
  
    return { allLinks, linkByLinkId, linksByUserId, addClassicLink, addShowLink};
};