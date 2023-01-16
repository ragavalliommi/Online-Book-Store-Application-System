import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'

function LoadMore(){

    const state = useContext(GlobalState)
    const [page, setPage] = state.booksAPI.page
    const [result] = state.booksAPI.result

    return (
        <div className="load_more">
            {
                result < page * 9 ? ""
                : <button onClick={() => setPage(page+1)}>Load More</button>
            }
        </div>
    )

}

export default LoadMore