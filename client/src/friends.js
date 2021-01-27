// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { receiveUsers, unfriend, accept } from "./actions";

// export default function Friends() {
//     const dispatch = useDispatch();
//     const friends = useSelector(
//         (state) =>
//             state.users && state.users.filter((user) => user.accepted == true)
//     );
//     const wannabes = useSelector(
//         (state) =>
//             state.users && state.users.filter((user) => user.accepted == false)
//     );
//     useEffect(() => {
//         dispatch(receiveUsers());
//     }, []);

//     if (!friends && !wannabes) {
//         return null;
//     }

//     return (
//         <div className="buddy-container">
//             <div className="buddy-center">
//                 <h2>Friends</h2>
//                 {friends.map((friend, idx) => (
//                     <div key={idx} className="users-container">
//                         <img
//                             className="profile-pic"
//                             src={
//                                 friend.profile_pic
//                                     ? friend.profile_pic
//                                     : "../logo3.gif"
//                             }
//                             alt={friend.first + " " + friend.last}
//                         />
//                         <div className="profile-info">
//                             <Link
//                                 className="nav-link"
//                                 to={"/user/" + friend.id}
//                             >
//                                 <h3>
//                                     {friend.first} {friend.last}
//                                 </h3>
//                             </Link>
//                             <button
//                                 className="btn"
//                                 onClick={() =>
//                                     dispatch(
//                                         unfriend("unfriend", true, friend.id)
//                                     )
//                                 }
//                             >
//                                 unfriend
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//                 <h2 className="wannabes">Wannabes</h2>
//                 {wannabes.map((wannabe, idx) => (
//                     <div key={idx} className="users-container">
//                         <img
//                             className="profile-pic"
//                             src={wannabe.profile_pic}
//                             alt={wannabe.first + " " + wannabe.last}
//                         />
//                         <div className="profile-info">
//                             <Link
//                                 className="nav-link"
//                                 to={"/user/" + wannabe.id}
//                             >
//                                 <h3>
//                                     {wannabe.first} {wannabe.last}
//                                 </h3>
//                             </Link>
//                             <button
//                                 className="btn"
//                                 onClick={() =>
//                                     dispatch(
//                                         accept("accept", false, wannabe.id)
//                                     )
//                                 }
//                             >
//                                 accept
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
