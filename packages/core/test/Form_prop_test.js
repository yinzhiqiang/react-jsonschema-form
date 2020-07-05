import { expect } from "chai";
import sinon from "sinon";
import fc from "fast-check";
import Ajv from "ajv";

import { createFormComponent, createSandbox, submitForm } from "./test_utils";

describe("Form property tests", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("formData is retained upon submit", () => {
    fc.assert(
      fc.property(fc.unicodeJsonObject(), data => {
        const { node, onSubmit } = createFormComponent({
          schema: {},
          formData: data,
        });
        submitForm(node);
        sinon.assert.calledWithMatch(onSubmit.lastCall, {
          formData: data,
        });
      })
    );
  });

  it("random schemas", () => {
    const properties = fc.letrec(tie => ({
      schema: fc.oneof(
        tie("string"),
        tie("integer"),
        tie("number"),
        tie("boolean"),
        tie("object"),
        tie("array")
      ),
      string: fc
        .string()
        .chain(value => fc.constant({ type: "string", default: value })),
      integer: fc
        .integer()
        .chain(value => fc.constant({ type: "integer", default: value })),
      number: fc
        .double()
        .chain(value => fc.constant({ type: "number", default: value })),
      boolean: fc
        .boolean()
        .chain(value => fc.constant({ type: "boolean", default: value })),
      object: fc
        .array(fc.tuple(fc.string(), tie("schema")), 0, 2)
        .chain(properties => {
          return fc.constant({
            type: "object",
            default: {},
            properties: Object.fromEntries(properties),
          });
        }),
      array: fc.oneof(tie("arrayNotFixed"), tie("arrayFixed")),
      arrayNotFixed: tie("schema").chain(items => {
        return fc.constant({ type: "array", default: [], items });
      }),
      // We can't generate *too* large arrays, or we get "Maximum call stack exceeded"
      arrayFixed: fc.array(tie("schema"), 1, 2).chain(items => {
        return fc.constant({ type: "array", default: [], items });
      }),
    }));
    const ajv = new Ajv({
      errorDataPath: "property",
      allErrors: true,
      multipleOfPrecision: 8,
      schemaId: "auto",
      unknownFormats: "ignore",
    });
    fc.assert(
      fc.property(properties.schema, schema => {
        console.error(schema);
        const { node, onSubmit } = createFormComponent({
          schema: schema,
          formData: undefined,
        });
        submitForm(node);
        sinon.assert.calledOnce(onSubmit);

        const { formData } = onSubmit.lastCall.args[0];
        ajv.validate(schema, formData);

        const unsupported = node.querySelectorAll(".unsupported-field");
        expect(unsupported.length).eql(0);
      }),
      { verbose: true }
    );
  });

  // describe("Empty schema", () => {
  //   it("should render a form tag", () => {
  //     const { node } = createFormComponent({ schema: {} });

  //     expect(node.tagName).eql("FORM");
  //   });

  //   it("should render a submit button", () => {
  //     const { node } = createFormComponent({ schema: {} });

  //     expect(node.querySelectorAll("button[type=submit]")).to.have.length.of(1);
  //   });

  //   it("should render children buttons", () => {
  //     const props = { schema: {} };
  //     const comp = renderIntoDocument(
  //       <Form {...props}>
  //         <button type="submit">Submit</button>
  //         <button type="submit">Another submit</button>
  //       </Form>
  //     );
  //     const node = findDOMNode(comp);
  //     expect(node.querySelectorAll("button[type=submit]")).to.have.length.of(2);
  //   });

  //   it("should render errors if schema isn't object", () => {
  //     const props = {
  //       schema: {
  //         type: "object",
  //         title: "object",
  //         properties: {
  //           firstName: "some mame",
  //           address: {
  //             $ref: "#/definitions/address",
  //           },
  //         },
  //         definitions: {
  //           address: {
  //             street: "some street",
  //           },
  //         },
  //       },
  //     };
  //     const comp = renderIntoDocument(
  //       <Form {...props}>
  //         <button type="submit">Submit</button>
  //       </Form>
  //     );
  //     const node = findDOMNode(comp);
  //     expect(node.querySelector(".unsupported-field").textContent).to.contain(
  //       "Unknown field type undefined"
  //     );
  //   });
  // });

  // describe("on component creation", () => {
  //   let onChangeProp;
  //   let formData;
  //   let schema;

  //   function createComponent() {
  //     renderIntoDocument(
  //       <Form schema={schema} onChange={onChangeProp} formData={formData}>
  //         <button type="submit">Submit</button>
  //         <button type="submit">Another submit</button>
  //       </Form>
  //     );
  //   }

  //   beforeEach(() => {
  //     onChangeProp = sinon.spy();
  //     schema = {
  //       type: "object",
  //       title: "root object",
  //       required: ["count"],
  //       properties: {
  //         count: {
  //           type: "number",
  //           default: 789,
  //         },
  //       },
  //     };
  //   });

  //   describe("when props.formData does not equal the default values", () => {
  //     beforeEach(() => {
  //       formData = {
  //         foo: 123,
  //       };
  //       createComponent();
  //     });

  //     it("should call props.onChange with current state", () => {
  //       sinon.assert.calledOnce(onChangeProp);
  //       sinon.assert.calledWith(onChangeProp, {
  //         formData: { ...formData, count: 789 },
  //         schema,
  //         errorSchema: {},
  //         errors: [],
  //         edit: true,
  //         uiSchema: {},
  //         idSchema: { $id: "root", count: { $id: "root_count" } },
  //         additionalMetaSchemas: undefined,
  //       });
  //     });
  //   });

  //   describe("when props.formData equals the default values", () => {
  //     beforeEach(() => {
  //       formData = {
  //         count: 789,
  //       };
  //       createComponent();
  //     });

  //     it("should not call props.onChange", () => {
  //       sinon.assert.notCalled(onChangeProp);
  //     });
  //   });
  // });

  // describe("Option idPrefix", function() {
  //   it("should change the rendered ids", function() {
  //     const schema = {
  //       type: "object",
  //       title: "root object",
  //       required: ["foo"],
  //       properties: {
  //         count: {
  //           type: "number",
  //         },
  //       },
  //     };
  //     const comp = renderIntoDocument(<Form schema={schema} idPrefix="rjsf" />);
  //     const node = findDOMNode(comp);
  //     const inputs = node.querySelectorAll("input");
  //     const ids = [];
  //     for (var i = 0, len = inputs.length; i < len; i++) {
  //       const input = inputs[i];
  //       ids.push(input.getAttribute("id"));
  //     }
  //     expect(ids).to.eql(["rjsf_count"]);
  //     expect(node.querySelector("fieldset").id).to.eql("rjsf");
  //   });
  // });
});
