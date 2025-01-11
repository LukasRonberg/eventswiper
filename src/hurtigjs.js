<!DOCTYPE html>
<html lang="en">
<head>
    <title>DOM Manipulation Example</title>
</head>
<body>
    <h1 id="title">Hello, World!</h1>
    <button onclick="changeText()">Click Me</button>
    <div id="container"></div>

    <script>
        function changeText() {
            document.getElementById("title").innerText = "Text Changed!";

            let newParagraph = document.createElement("p");
            newParagraph.innerText = "This is a new paragraph added dynamically.";

            document.getElementById("container").appendChild(newParagraph);
        }
    </script>
</body>
</html>
