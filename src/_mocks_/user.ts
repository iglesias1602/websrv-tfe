import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { mockImgAvatar } from '@/utils/mockImages';
import { IUser } from '@/models';

const users: IUser[] = [...Array(24)].map((_, index) => ({
    id: faker.datatype.uuid() as string,
    avatarUrl: mockImgAvatar(index + 1),
    name: faker.name.fullName() as string,
    group: sample([
        '1TL1',
        '1TL2',
        '1TM1',
        '1TM2',
        '2TL1',
        '2TL2',
        '2TM1',
        '2TM2',
        '3TL1',
        '3TL2'
    ])
}));

export default users;
