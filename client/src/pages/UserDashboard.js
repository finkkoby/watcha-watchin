import { useContext } from "react";

import AppContext from "../context/AppContext";

function UserDashboard() {
    const { user, navigate } = useContext(AppContext);

    return (
        <div className='dash-container'>
            <div id='column1' className='dash-column'>
                <div className='dash-box' id='button-bar'>
                    <button id='create-room' onClick={() => navigate('/user/room/new')}>create room</button>
                    <button id='join-room'>join room</button>
                </div>
                <div className='dash-box' id='recent-videos'>
                    <h3>recent videos</h3>
                    <div id='recent-videos-list'>
                        <p>video 1</p>
                        <p>video 2</p>
                        <p>video 3</p>
                    </div>
                </div>
            </div>
            <div id='column2' className='dash-column'>
                <div className='dash-box' id='friends-list'>
                    <h3>friends</h3>
                    <div id='friends-list-list'>
                        <p>friend 1</p>
                        <p>friend 2</p>
                        <p>friend 3</p>
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default UserDashboard;