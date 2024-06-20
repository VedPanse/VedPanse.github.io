document.addEventListener('DOMContentLoaded', () => {
   const completed = document.querySelector("#completed");
   const ongoing = document.querySelector("#ongoing");


   document.querySelector(".selector .completed").addEventListener('click', () => {
      completed.style.display = 'block';
      ongoing.style.display = 'none';
      document.querySelector('.selector .completed').classList.add('active');
      document.querySelector('.selector .ongoing').classList.remove('active');
   });

   document.querySelector(".selector .ongoing").addEventListener('click', () => {
      completed.style.display = 'none';
      ongoing.style.display = 'block';
      document.querySelector(".selector .completed").classList.remove('active');
      document.querySelector(".selector .ongoing").classList.add('active');
   });
});