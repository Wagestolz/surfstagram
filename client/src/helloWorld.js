import Greetee from "./greetee";
import Counter from "./counter";

export default function HelloWorld() {
    const name = "Thorsten";
    return (
        <div className="newClass">
            Hello <Greetee name={name} />
            <Counter />
        </div>
    );
}

// start.js -> renders helloWorld
// helloWorld -> renders Greetee & Counter
