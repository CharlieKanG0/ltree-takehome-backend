import { Low, JSONFile, LowSync, JSONFileSync } from 'lowdb';

export const initContext = () => {
    const db = new LowSync(new JSONFileSync('database/db.json'));
    db.read();
    const { users, links } = db.data;

    return {
        UserService: userService(users),
        LinkService: linkService(links)
    }
}

// Resolver service
const userService = (users) => {
    const allUsers = () => users;
    const userByUserId = ({ id }) => users.find(u => u.id === id);
  
    return { userByUserId, allUsers };
}; 

const linkService = (links) => {
    const allLinks = () => links;
    const linkByLinkId = ({ id }) => links.find(l => l.id === id);
    const linksByUserId = ({ id }) => links.filter(l => l.userId === id);
  
    return { allLinks, linkByLinkId, linksByUserId };
};