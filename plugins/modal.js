/*******************************************************/
/*         NUXT plugin and reference injection         */
/*******************************************************/

/*
 * The structure of the modal will be as follow:
 * function create()
 *    + BModal (Buefy modal)
 *      + Action Modal (works on promise)
 *        + Injeted component
 */

import { ModalProgrammatic } from 'buefy'
import ActionModal from '@/components/app/ActionModal.vue'

export default function (context, inject) {
  const promodal = {}

  promodal.ask = function (text, parent, yesText = 'OK') {
    return this.create(
      {
        component: text,
      },
      parent,
      {
        yesText,
        size: 'xs',
      }
    )
  }

  promodal.notify = function (text, parent, html = false) {
    return this.create(
      {
        component: text,
      },
      parent,
      {
        yesOnly: true,
        yesText: 'OK',
        html,
        size: 'xs',
      }
    )
  }

  promodal.iconNotify = function (
    title,
    text,
    icon = null,
    parent,
    html = false
  ) {
    return this.create(
      {
        component: text,
      },
      parent,
      {
        title,
        icon,
        yesOnly: true,
        yesText: 'Ok',
        html,
        size: 'xs',
      }
    )
  }

  /*
   * options: { component, props, response }
   * response: Object | Array. If Array create a new object
   *
   */
  promodal.create = function (options = {}, parent, modalOptions = {}) {
    return new Promise(function (resolve, reject) {
      // options.promiseResolver = resolve
      // options.promiseRejecter = reject

      // if (response.constructor === Array) {
      //   resp = {}
      //   for (let i = 0; i < response.length; ++i)
      //     resp[response[i]] = null
      // }

      let width

      switch (modalOptions.size) {
        case 'xxs':
          width = 320
          break
        case 'xs':
          width = 400
          break
        case 's':
          width = 480
          break
        case 'm':
          width = 560
          break
        case 'l':
          width = 640
          break
        case 'xl':
          width = 720
          break
        case 'xxl':
          width = 800
          break
      }

      // if (modalOptions.width) {
      //   return ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(value) !== -1
      // }

      ModalProgrammatic.open({
        parent,
        component: ActionModal,
        hasModalCard: true,
        canCancel: [], // make configurable
        width,
        props: {
          /* ActionModal data */
          icon: modalOptions.icon,
          title: modalOptions.title,
          yesText: modalOptions.yesText,
          noText: modalOptions.noText,
          noOnly: modalOptions.noOnly,
          yesOnly: modalOptions.yesOnly,
          disposable: modalOptions.disposable,
          simple: modalOptions.simple,
          html: modalOptions.html,
          tag: modalOptions.tag,

          /* Injected Component data */
          component: options.component,
          props: options.props,
          response: options.response,
          listeners: options.listeners,
          resolver: resolve,
          rejecter: reject,
        },
      })
    })
  }

  /* inject backend reference into application instance */
  inject('promodal', promodal)
}
