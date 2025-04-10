import { useState } from "react";
import axios from "axios"
import * as XLSX from "xlsx"
const App = () => {

    const [msg, setmsg] = useState("")
    const [status, setstatus] = useState(false)
    const [emailList, setEmailList] = useState([])

    function handlemsg(event) {
        setmsg(event.target.value)
    }

    function handlefile(event) {

        const file = event.target.files[0]
        console.log(file)

        const reader = new FileReader()

        reader.onload = function (e) {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
            const totalemail = emailList.map(function (item) { return item.A })
            console.log(totalemail)
            setEmailList(totalemail)
        }

        // Binary Format
        reader.readAsArrayBuffer(file)
    }

    function send() {
        setstatus(true)
        axios.post("http://localhost:5000/sendemail", { msg: msg, emailList:emailList})
            .then(function (data) {
                if (data.data === true) {
                    alert("Email Sent Successfully")
                    setstatus(false)
                }
                else {
                    alert("Failed")
                }
            })
    }

return (
  <div>
    <div className='bg-gradient-to-br from-purple-800 to-blue-700 text-white text-center'>
      <h1 className='text-2xl font-medium px-5 py-3'>BulkMail</h1>
    </div>
    <div className='bg-gradient-to-br from-purple-600 to-blue-500 text-white text-center'>
      <h1 className='text-xl font-medium px-5 py-3'>Simplify the process of sending multiple emails</h1>
    </div>
    <div className='bg-gradient-to-br from-purple-500 to-blue-400 text-white text-center'>
      <h1 className='text-xl font-medium px-5 py-3'>Drag and Drop</h1>
    </div>
    <div className='bg-gradient-to-br from-purple-400 to-blue-300 flex flex-col items-center  px-5 py-3'>
      <textarea onChange={handlemsg} value={msg} className='w-[80%] h-32 py-2 px-2 border border-black text-black placeholder-black' placeholder='Enter the Email text.....' style={{ borderRadius: "10px 30px", background: `repeating-radial-gradient(circle,#ba8cfc,#a6aafd 20%)` }}></textarea>
      <div>
        <input onChange={handlefile} className='mt-4 border-2 px-4 py-2 border-dashed mb-5 bg-purple-400' type='file'></input>
      </div>
      <div>
        <p className='text-lg'>Total Emails in the file : {emailList.length}</p>
      </div>
      <div>
        <button onClick={send} className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-purple-400 transition duration-300 ease-out border-2 border-purple-400 rounded-full shadow-md group">
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-black duration-300 -translate-x-full bg-gradient-to-br from-purple-400 to-blue-300 group-hover:translate-x-0 ease">
            <svg className="w-7 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease">{status ? "Sending..." : "Send"}</span>
          <span className="relative invisible">Send</span>
        </button>
      </div>
    </div>
    <div>

    </div>
  </div>
)
}


export default App