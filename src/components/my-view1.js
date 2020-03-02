/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';


// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyView1 extends PageViewElement {
  static get properties() { 
    return { 
      host: { type: String },
      pathStudent: { type: String },
      pathQuestions: { type: String },
      question: { type: Object },
      name: { type: String },
      surname: { type: String },
      stateButton: { type: Boolean },
      body: {type: Object},
      method: { type: String },
      question: { type: String },
      answerStudent: { type: String },
      disableRecord: { type: Boolean }
    };
  }
  static get styles() {
    return [
      SharedStyles

    ];
  }
  constructor() {
    super();
    this.host = 'http://acasistemasinformaticos853.ga:3000';
    this.pathStudent ='/student';
    this.pathQuestions = '/questions';
    this.name = '';
    this.surname = '';
    this.question = {};
    this.answerStudent ='';
    this.disableRecord = true;
  }
  firstUpdated() {
    this.shadowRoot.getElementById('buttonContinue').disabled = true;
    this.shadowRoot.getElementById('dialog').open();
  }
  createStudent(){
    let request = this.shadowRoot.getElementById('newStudent');
    this.shadowRoot.getElementById('dialog').close();
    this.body = {
      'code': 0,
      'name': this.name,
      'surname': this.surname
    };
    request.body = this.body;
    request.method = 'POST';
    request.url = this.host + this.pathStudent;
    request.generateRequest();
    //busqueda de preguntas
    request = this.shadowRoot.getElementById('loadQuestions');
    request.url = this.host + this.pathQuestions + '/1';
    request.method = 'GET';
    request.generateRequest();
  }
  validateInputs(){
    this.name  =this.shadowRoot.getElementById('inputName').value;
    this.surname  =this.shadowRoot.getElementById('inputSurName').value;
    let button = this.shadowRoot.getElementById('buttonContinue');
    if( this.name != "" && this.surname != "") {
      button.disabled = false;
      button.classList.remove("disabled");
      button.classList.add("indigo");
    } else {
      button.disabled = true;
      this.shadowRoot.getElementById('buttonContinue').classList.remove("indigo");
      this.shadowRoot.getElementById('buttonContinue').classList.add("disabled");
     
    }
  }
  questionsResponse(e){
    this.question = e.detail.response;
  }
  evaluateAnswer(){
    console.log('rst: ',this.answerStudent);
  }
  activateRecord(e) {
    this.answerStudent = e.detail.item.name;
    if (this.answerStudent != '') {
      this.disableRecord=false;
    }
  }
  render() {
    return html`
    <style>
      :host {
        --iron-overlay-backdrop-opacity:1;
      }
      .front{
        width: 100%;
        height: 100%;
      }
      .center{
        text-align: center;
      }
      paper-button.indigo {
      background-color: var(--paper-indigo-500);
      color: white;
      --paper-button-raised-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
        };
      }
      paper-button.disabled {
        color: white;
        background-color: bisque;
      }
      .evaluate {
        display: flex;
        flex-direction: column;
      }
      .vertical {
        display: inline-grid;
      }
    </style> 
    <paper-dialog id="dialog" class="front">
      <h2>Bienvenido Estudiante....</h2>
      <section>
        <h3 class="center">Danos tus Datos para empezar</h3>
        <div>
        <paper-input id="inputName" @change="${this.validateInputs}" .value="${this.name}" label="Nombre del alumno"></paper-input>
        <paper-input id="inputSurName" @keyup="${this.validateInputs}" .value="${this.surname}" label="Apellido del alumno"></paper-input>
        </div>
      </section>
      <section class="center">
      <paper-button id="buttonContinue" @click="${this.createStudent}" raised class="custom disabled"> Continuar </paper-button>
      </section>
      <paper-dialog-scrollable>
        <p>Scrolalble content...</p>
      </paper-dialog-scrollable>
    </paper-dialog>
      <section>
        <h2 >Metodologia de Estudio</h2>
        <p>En este recurso se encontrara con una serie de videos en los cuales son una formacion en el tema seleccionado. Lo cual prodra optar por completar una breve evalucion respecto al tema tratado</p>
      </section>
      <section>
        <h2>Sistemas de Información</h2>
        <div>
          <iframe 
            width="560"
            height="315"
            src="https://www.youtube.com/embed/HlA4QJm7reA"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </section>
      <section class="evaluate">
        <h3>Evaluación</h3>
        <label id="label3">${this.question.question_literal}</label>
        <paper-radio-group @iron-select="${this.activateRecord}" class="vertical">
          <paper-radio-button name="1">${this.question.answer1}</paper-radio-button>
          <paper-radio-button name="2">${this.question.answer2}</paper-radio-button>
          <paper-radio-button name="3">${this.question.answer3}</paper-radio-button>
        </paper-radio-group>
        <paper-button id="buttonEvaluate" ?disabled="${this.disableRecord}" @click="${this.evaluateAnswer}" raised class="custom indigo"> Grabar </paper-button>
        <iron-ajax
          id="newStudent"
          handle-as="json"
          content-type="application/json"
          @response="${this.handleResponse}">
        </iron-ajax>
        <iron-ajax
          id="loadQuestions"
          handle-as="json"
          content-type="application/json"
          @response="${this.questionsResponse}">
        </iron-ajax>
        
      </section>
      
      
    `;
  }
}

window.customElements.define('my-view1', MyView1);
