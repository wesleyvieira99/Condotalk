import User from "../models/User.js"

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        //getting the user friends by id
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        //Getting the user and the friend of user for remove
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        //if the friend passed includes in the list of friends of user
        if (user.friends.includes(friendId)){

            //remove both of two at the list of friends
            user.friends = user.friends.filter ((id) => id !== friendId);
            friend.friends = friend.friends.filter ((id) => id !== id);
        //if the friend is not in the list of friends of the user
        } else {
            //add both of two at the list of friends
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        //save the instances of two
        await user.save();
        await friend.save();

        //getting the user friends by id
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}