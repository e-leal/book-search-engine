import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_ME} from '../utils/queries';

const Home = () => {
    // use useQuery hook to make query request
    const {loading, data} = useQuery(GET_ME);
    const books = data?.books || [];
    console.log(books);
    return (
        <main>
            <div className='flex-row justify-space-between'>
                <div className='col-12 mb-3'></div>
            </div>
        </main>
    )
}

export default Home;