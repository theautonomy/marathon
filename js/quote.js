export default {
  props: {
    msg: String
  },
  template: `
    <div class="container  mt-4 rounded">
        <blockquote class="blockquote text-center font-weight-bold font-italic">
            <i style="font-size:20px;color:black">"{{msg}}"</i>
        </blockquote>
    </div> 
  `
}