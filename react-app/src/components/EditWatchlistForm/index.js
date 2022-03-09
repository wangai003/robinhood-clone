import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createWatchlist, editWatchlist } from '../../store/watchlist';
const EditWatchlistForm = ({ watchlist,hideform}) => {
	const sessionUser = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const [title, setTitle] = useState(watchlist.name);
	const [validationErrors,setValidationErrors] = useState([]);


	const updateTitle = (e) => setTitle(e.target.value);
	useEffect(()=>{
		const button = document.getElementById("submit")
		if(title === "" || title.toLowerCase() === watchlist.name.toLowerCase()){
			button.disabled = true;
			button.style.opacity = .4;
		}
		else{
			button.disabled = false;
			button.style.opacity = 1;
		}
	},[title])
	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = [];
		if(title){

			const button = document.getElementById("submit")
			const titleInput = document.getElementById("titleInput")

			button.disabled = true;
			titleInput.disabled = true;
            let editedWatchlist = await dispatch(editWatchlist(title,sessionUser.id,watchlist.id))
			if(editedWatchlist.errors){
				for(let currErr in editedWatchlist.errors){
					if(editedWatchlist.errors[currErr] === "You provided a name for a Watchlist that you have already created"){
						setTitle("")
					}
					errors.push(`${editedWatchlist.errors[currErr]}`)
				}
				button.disabled = false;
				titleInput.disabled = false;
				setValidationErrors(errors);
			} else if (editedWatchlist){
                // new watch list was created need to rerender or reload
                hideform();
			}
		}
	};
	let count = 0
	return (
		<section>
			<div >
			<form className="createWatchlistForm"onSubmit={handleSubmit}>
			{validationErrors.length > 0 && (
				<div className='errorsContainer'>
					{validationErrors.map( (currError) => {
						return <p key={`error-${count++}`}>{currError}</p>
					})}
				</div>
			)}
			<label className='titleInputLabel'>
				Title
			<input type='textarea' id='titleInput' placeholder='Title' value={title} onChange={updateTitle}/>
			</label>
			<input id="submit" type={"submit"}></input>
			</form>
			</div>
		</section>
	);
};

export default EditWatchlistForm
