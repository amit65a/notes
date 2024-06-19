import Notes from "./Notes"

const Home = (props) => {


    return (
        <div>
            <div className="container my-3">
                <h2>Your Notes</h2>
                <Notes showAlert={props.showAlert} />

            </div>
        </div>
    )
}

export default Home