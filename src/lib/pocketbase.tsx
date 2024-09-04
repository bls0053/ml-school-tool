import PocketBase from 'pocketbase';

const pb = new PocketBase('https://react-test-base.pockethost.io');

export async function incrementVisitCount() {
    try {
        const visitRecord = await pb.collection('Visits').getOne('uh1hztwz5zpuj3h');

        const updateVisitRecord = await pb.collection('Visits').update('uh1hztwz5zpuj3h', {
            count: visitRecord.count + 1
        });
        console.log('Visit count incremented:', updateVisitRecord.count);
    }
    catch (error) {
        console.error('Error incrementing visit count:', error);
    }
}