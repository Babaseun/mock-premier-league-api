import { User } from "../models/user";
import { Users } from "./add-user";

const cleanDb = async () => {
	try {
		await User.deleteMany({});
		// await Team.deleteMany({});
		// await Fixture.deleteMany({});
		console.log('Db successfully cleared');
	} catch (error) {
		console.log('Error :', error);
		return error;
	}
};

const seedUser = async () => {
	try {
		return Users.map(async user => {
			const newUser = await User.create(user);
			await newUser.save();
			
		});
	} catch (error) {
		console.log('Error :', error);
		return error;
	}
};
const seed = async () => {
	return await cleanDb()
	.then(async () => {
		// await seedTeam();
		await seedUser();
		// await seedFixture();
	})
	.then(() => console.log(`Database has been successfully seeded`))
	.catch(error => {
		console.log('Error :', error);
		return error;
	});
};
export default seed;