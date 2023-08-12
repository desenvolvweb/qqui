let QQForm = React.createClass({
  getInitialState() {
    return {
      value: "atLeast",
    };
  },
  update(e) {
    e.preventDefault();
    let theVal = {
      selector: React.findDOMNode(this.refs.selectorName).value,
      type: this.state.value,
      amount: {
        one: React.findDOMNode(this.refs.amountOne).value,
        two: React.findDOMNode(this.refs.amountTwo).value,
      },
    };
    if (!theVal.selector || !theVal.amount.one) {
      return;
    }
    this.props.onUpdate(theVal);
  },
  displayAmount(e) {
    this.setState({ value: e.target.value });
  },
  render() {
    let isBetween;
    if (this.state.value == "between") {
      isBetween = true;
    } else {
      isBetween = false;
    }
    return (
      <section className="formControl">
        <h2>Monte uma Quantity Query</h2>
        <form onSubmit={this.update}>
          <div className="inputRow">
            <label htmlFor="element" className="inputLabel">
              Qual elemento será contado{" "}
              <span
                className="hint hint--bottom"
                data-hint="Os elementos que serão selecionados na query"
              >
                ?
              </span>
            </label>
            <input
              type="text"
              id="element"
              autoFocus
              ref="selectorName"
              placeholder="ex. ul li"
              required
            />
          </div>
          <div className="inputRow">
            <label htmlFor="type">
              Tipo{" "}
              <span
                className="hint hint--bottom hint--bounce"
                data-hint="Que tipo de query será usada para contar os elementos"
              >
                ?
              </span>
            </label>
            <select
              id="type"
              ref="type"
              onChange={this.displayAmount}
              value={this.state.value}
            >
              <option value="atLeast">Pelo Menos</option>
              <option value="atMost">No Máximo</option>
              <option value="between">Entre</option>
            </select>
          </div>
          <div className="inputRow">
            <label for="amount" className="inputLabel">
              Quantidade de Itens{" "}
              <span
                className="hint hint--bottom hint--bounce"
                data-hint="Itens para contar"
              >
                ?
              </span>
            </label>
            <input
              type="number"
              ref="amountOne"
              required
              placeholder={
                isBetween
                  ? "Pelo menos # de itens para contar"
                  : "# de itens para contar"
              }
            />
            <input
              type={isBetween ? "number" : "hidden"}
              ref="amountTwo"
              required
              placeholder="No máximo # de itens para contar"
            />
          </div>
          <input
            type="submit"
            className="submit"
            value="Criar Quantity Query"
          />
        </form>
      </section>
    );
  },
});

let QQExample = React.createClass({
  getInitialState() {
    return {
      items: ["i", "i", "i", "i", "i"],
    };
  },
  addItem() {
    let newArray = this.state.items;
    newArray.push("i");
    this.setState({ arr: newArray });
    console.log(this.state.items);
  },
  removeItem() {
    if (this.state.items.length > 1) {
      let newArray = this.state.items;
      newArray.pop();
      this.setState({ arr: newArray });
    } else {
      return;
    }
  },
  render() {
    let itemObjects = this.state.items.map(function (item) {
      return <li className="item"></li>;
    });
    return (
      <div>
        <style>{this.props.styles}</style>
        <p>
          <br />
          Sua quantity query será refletida nos itens abaixo por uma mudança de
          cor.
        </p>
        <header className="controls">
          <div onClick={this.addItem} className="itemClick">
            <i className="fa fa-plus-circle "></i> Adicionar Item
          </div>
          <div onClick={this.removeItem} className="itemClick">
            <i className="fa fa-minus-circle"></i> Remover Item
          </div>
        </header>
        <section className="itemList">
          <ul>{itemObjects}</ul>
        </section>
      </div>
    );
  },
});

let QQDisplay = React.createClass({
  render() {
    let type = this.props.data.type,
      amountOne = this.props.data.amount.one,
      amountTwo = this.props.data.amount.two,
      selector = this.props.data.selector,
      selectTail = selector.split(" ").splice(-1)[0];
    var pseudo,
      equation = "// Seu código vai aparecer aqui",
      styles;
    if (type === "atLeast") {
      equation = `${selector}:nth-last-child(n+${amountOne}), ${selector}:nth-last-child(n+${amountOne}) ~ ${selectTail} { }`;
      styles = `section.itemList ul>li:nth-last-child(n+${amountOne}), section.itemList ul>li:nth-last-child(n+${amountOne}) ~ li { background: #D81B60 !important; }`;
    } else if (type === "atMost") {
      equation = `${selector}:nth-last-child(-n+${amountOne}):first-child, ${selector}:nth-last-child(-n+${amountOne}):first-child ~ ${selectTail} { }`;
      styles = `section.itemList ul>li:nth-last-child(-n+${amountOne}):first-child, section.itemList ul>li:nth-last-child(-n+${amountOne}):first-child ~ li { background: #D81B60 !important;  }`;
    } else if (type === "between") {
      equation = `${selector}:nth-last-child(n+${amountOne}):nth-last-child(-n+${amountTwo}):first-child, ${selector}:nth-last-child(n+${amountOne}):nth-last-child(-n+${amountTwo}):first-child ~ ${selectTail} { }`;
      styles = `section.itemList ul li:nth-last-child(n+${amountOne}):nth-last-child(-n+${amountTwo}):first-child, section.itemList ul li:nth-last-child(n+${amountOne}):nth-last-child(-n+${amountTwo}):first-child ~ li { background: #D81B60 !important; }`;
    }
    return (
      <div className="displayBody">
        <section className="equationDisplay">
          <h2>Código</h2>
          <p>Copie e cole o código abaixo em seus estilos</p>
          <code>{equation}</code>
        </section>
        <QQExample styles={styles} />
      </div>
    );
  },
});

let QQApp = React.createClass({
  getInitialState() {
    return {
      data: {
        selector: "",
        amount: {
          one: "",
          two: "",
        },
        type: "",
      },
    };
  },
  onUpdate(val) {
    // console.log(val)
    this.setState({
      data: {
        selector: val.selector,
        amount: {
          one: val.amount.one,
          two: val.amount.two,
        },
        type: val.type,
      },
    });
  },
  render() {
    return (
      <section className="appBody">
        <QQForm onUpdate={this.onUpdate} data={this.state.data} />
        <QQDisplay data={this.state.data} />
      </section>
    );
  },
});

$(function () {
  console.log(
    "What's it built with? React, Babel and PostCSS! Help me improve or fix any issues! https://github.com/drewminns/qqui"
  );
  console.log("Follow me on Twitter: @drewisthe");
  console.log("Find more crazy cool things at drewminns.com");
  React.render(<QQApp />, document.getElementById("content"));
  $("p.explain").on("click", function () {
    $("#lightbox").addClass("show");
  });
  $(".closeButton").on("click", function () {
    $("#lightbox").removeClass("show");
  });
  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      $("#lightbox").removeClass("show");
    }
  });
});
