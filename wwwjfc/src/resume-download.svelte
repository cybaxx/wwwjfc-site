<script>
    // Assuming you have the files in your `static` folder or a hosted URL
    let pdfResume = "../static/eva-ever-resume.pdf"; // Change the path
    let docxResume = "../../static/eva-ever-resume.doc"; // Change the path

    // Optional: You can handle logic for tracking or analytics when the button is clicked
    function downloadResume(format) {
        const link = document.createElement("a");

        if (format === "pdf") {
            link.href = pdfResume;
            link.download = "My_Resume.pdf"; // Specify the file name for the download
        } else if (format === "docx") {
            link.href = docxResume;
            link.download = "My_Resume.docx"; // Specify the file name for the download
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>

<!-- The Button Structure -->
<div>
    <button on:click={() => downloadResume("pdf")}>
        Download Resume (PDF)
    </button>

    <button on:click={() => downloadResume("docx")}>
        Download Resume (DOCX)
    </button>
</div>

<style>
    button {
        padding: 10px 15px;
        margin: 5px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
