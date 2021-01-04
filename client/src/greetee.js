export default function Greetee(props) {
    console.log("props in Greetee: ", props);
    return <span>{props.name}</span>;
}
