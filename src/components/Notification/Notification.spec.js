import Notification from "./Notification.vue";
import { mount } from "@vue/test-utils";

describe("Notification", () => {
  it("渲染标题title", () => {
    const title = "this is a title";
    const wrapper = mount(Notification, {
      props: {
        title,
      },
    });
    expect(wrapper.get(".el-notification__title").text()).toContain(title);
  });

  it("信息message渲染", () => {
    const message = "this is a message";
    const wrapper = mount(Notification, {
      props: {
        message,
      },
    });
    expect(wrapper.get(".el-notification__content").text()).toContain(message);
  });

  it("位置渲染", () => {
    const position = "bottom-right";
    const wrapper = mount(Notification, {
      props: {
        position,
      },
    });
    expect(wrapper.find(".el-notification").classes()).toContain("right");
    expect(wrapper.vm.verticalProperty).toBe("bottom");
    expect(wrapper.find(".el-notification").element.style.bottom).toBe("0px");
  });

  it("位置偏移", () => {
    const verticalOffset = 50;
    const wrapper = mount(Notification, {
      props: {
        verticalOffset,
      },
    });
    expect(wrapper.vm.verticalProperty).toBe("top");
    expect(wrapper.find(".el-notification").element.style.top).toBe(
      `${verticalOffset}px`
    );
  });

  
it('set the showClose ', () => {
    const showClose = true
    const wrapper = mount(Notification, {
      props: {
        showClose
      }
    })
    expect(wrapper.find('.el-notification__closeBtn').exists()).toBe(true)
    expect(wrapper.find('.el-icon-close').exists()).toBe(true)
  })

  it('点击关闭按钮', async () => {
    const showClose = true
    const wrapper = mount(Notification, {
      props: {
        showClose
      }
    })
    const closeBtn = wrapper.get('.el-notification__closeBtn')
    await closeBtn.trigger('click')
    expect(wrapper.get('.el-notification').isVisible()).toBe(false)
  })

  it('持续时间之后自动管理', async () => {
    jest.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        duration: 1000
      }
    })
    jest.runTimersToTime(1000)
    await flushPromises()
    expect(wrapper.get('.el-notification').isVisible()).toBe(false)
     })
});
