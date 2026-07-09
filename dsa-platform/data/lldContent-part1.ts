// LLD Part 1: SOLID Principles + Creational Patterns + Structural Patterns

const lldPart1 = {
  "solid-principles": {
    id: "solid-principles",
    title: "SOLID Principles",
    chapters: [
      {
        id: "srp",
        num: 1,
        title: "SRP — Single Responsibility Principle",
        blocks: [
          { type: "eli5", text: "Give each class ONE job. A class that fetches data, prints it, AND emails it is doing three jobs — split it into three. One class, one job, one reason to ever touch it again." },
          { type: "para", text: "A class should have only one reason to change. Every module, class, or function should be responsible for a single part of the program's functionality. 'Reason to change' = stakeholder or actor whose requirements drive that change." },
          { type: "analogy", text: "A Swiss Army knife is cool as a product but terrible for surgery. A scalpel does one thing and does it perfectly. SRP means every class should be a scalpel, not a Swiss Army knife." },
          { type: "heading", text: "The God Class Anti-Pattern" },
          { type: "para", text: "God classes violate SRP by knowing too much and doing too much. An Order class that handles pricing, tax calculation, persistence, and email notification has five reasons to change. Split by responsibility: Order (data), OrderPricer (pricing), OrderRepository (persistence), OrderNotifier (notifications)." },
          { type: "pre", text: "// VIOLATES SRP\nclass Order {\npublic:\n    double calculatePrice();\n    void   applyTax();\n    void   saveToDb();\n    void   sendConfirmationEmail();\n    void   generateInvoicePdf();\n};\n\n// FOLLOWS SRP\nstruct Order {                 // only holds data\n    std::vector<Item> items;\n    Customer          customer;\n};\n\nclass OrderPricer {            // only pricing logic\npublic:\n    double calculate(const Order& order);\n};\n\nclass OrderRepository {        // only persistence\npublic:\n    void save(const Order& order);\n};\n\nclass OrderNotifier {          // only notifications\npublic:\n    void sendConfirmation(const Order& order);\n};" },
          { type: "memory-trick", text: "SRP test: describe what your class does. If the sentence has 'and', it violates SRP. 'This class processes orders AND sends emails AND saves to DB' = 3 classes." },
          { type: "common-mistake", text: "Over-engineering SRP into 1-method classes. SRP is about reasons to change, not about method count. A UserValidator with 5 validation methods is fine — all change for the same reason (validation rules)." },
          { type: "interview", qas: [
            { q: "What is a 'reason to change' in SRP?", a: "A stakeholder or actor whose requirements would force a modification. If Marketing changes pricing rules AND DB Admin changes schema AND DevOps changes logging format — those are three different reasons. Group code so each group of stakeholders touches one class." },
            { q: "How do you detect SRP violation in code review?", a: "Look for: (1) class with 'Manager' or 'Utils' in name — God class smell. (2) includes/imports spanning multiple domains (DB + email + pricing). (3) methods that touch unrelated state. (4) test files that need 5+ mocks. Too many mocks = too many dependencies = too many responsibilities." },
          ]},
        ],
      },
      {
        id: "ocp",
        num: 2,
        title: "OCP — Open/Closed Principle",
        blocks: [
          { type: "eli5", text: "Add new features by writing NEW code, not by editing old working code. If adding a shape means opening and changing an existing calculator class, that's exactly the smell OCP fixes." },
          { type: "para", text: "Software entities should be open for extension but closed for modification. When requirements change, add new code rather than modifying existing tested code. Achieve this through abstraction — depend on interfaces (abstract base classes), not concrete classes." },
          { type: "heading", text: "The Shape Example" },
          { type: "pre", text: "// VIOLATES OCP — every new shape requires modifying AreaCalculator\nclass AreaCalculator {\npublic:\n    double area(const Shape& shape) {\n        if (auto c = dynamic_cast<const Circle*>(&shape)) return 3.14 * c->radius * c->radius;\n        if (auto s = dynamic_cast<const Square*>(&shape)) return s->side * s->side;\n        // Adding Triangle requires changing this method\n        return 0;\n    }\n};\n\n// FOLLOWS OCP — add new shapes without touching AreaCalculator\nclass Shape {\npublic:\n    virtual double area() const = 0;   // pure virtual = abstract\n    virtual ~Shape() = default;\n};\n\nclass Circle : public Shape {\n    double radius;\npublic:\n    double area() const override { return 3.14 * radius * radius; }\n};\n\nclass Triangle : public Shape {        // NEW shape, zero changes to existing code\n    double base, height;\npublic:\n    double area() const override { return 0.5 * base * height; }\n};\n\nclass AreaCalculator {\npublic:\n    double area(const Shape& shape) { return shape.area(); }\n};" },
          { type: "analogy", text: "A plugin architecture is OCP in action. Chrome extensions add new browser behavior without touching Chrome's source code. VS Code extensions add new features without modifying the editor. Design your core like an editor — stable, extensible." },
          { type: "memory-trick", text: "OCP = 'Seal the old, open a new room.' Never renovate the old room (closed for modification). Build a new room (open for extension). The building's structure (interfaces) connects them." },
          { type: "interview", qas: [
            { q: "How do you use OCP in a payment processing system?", a: "Define a PaymentProcessor interface with a process(amount) method. Implement CreditCardProcessor, PayPalProcessor, CryptoProcessor as separate classes. Adding a new payment method = new class, zero changes to checkout flow. The switch/if-chain in checkout is the OCP violation to eliminate." },
            { q: "Is OCP always achievable? When do you accept modification?", a: "No. OCP is a direction, not a rule. When the abstraction itself is wrong — the interface design was bad — you must modify. Bug fixes modify. Performance optimizations modify. OCP applies to feature additions: new behaviors should extend, not modify. Accept modification when the contract itself needs to change." },
          ]},
        ],
      },
      {
        id: "lsp",
        num: 3,
        title: "LSP — Liskov Substitution Principle",
        blocks: [
          { type: "eli5", text: "If code expects a Bird, any kind of Bird you hand it should just work. If a Penguin breaks code that calls fly(), then Penguin shouldn't be a subclass of Bird in the first place." },
          { type: "para", text: "Subtypes must be substitutable for their base types without breaking program correctness. If S is a subtype of T, objects of S can replace objects of T without altering program behavior. It's not just about type compatibility — it's about behavioral compatibility." },
          { type: "heading", text: "The Square-Rectangle Trap" },
          { type: "pre", text: "// CLASSIC LSP VIOLATION\nclass Rectangle {\nprotected:\n    int width = 0, height = 0;\npublic:\n    virtual void setWidth(int w)  { width = w; }\n    virtual void setHeight(int h) { height = h; }\n    int area() const { return width * height; }\n};\n\nclass Square : public Rectangle {   // Mathematically correct, LSP violation!\npublic:\n    void setWidth(int w)  override { width = w; height = w; }  // forces both\n    void setHeight(int h) override { width = h; height = h; }\n};\n\n// This test passes for Rectangle but BREAKS for Square\nvoid testRectangle(Rectangle& r) {\n    r.setWidth(5);\n    r.setHeight(4);\n    assert(r.area() == 20);   // FAILS for Square (returns 16!)\n}\n\n// FIX: Don't inherit; use a common abstraction, not one from the other\nclass Shape {\npublic:\n    virtual int area() const = 0;\n    virtual ~Shape() = default;\n};\n\nclass Rectangle2 : public Shape { /* ... */ };\nclass Square2    : public Shape { /* ... */ };  // neither inherits the other" },
          { type: "memory-trick", text: "LSP = 'Is-a is not enough. Behaves-as is required.' A Square IS-A Rectangle mathematically. But Square doesn't BEHAVE-AS Rectangle (changing width also changes height). Use inheritance only when the behavioral contract holds." },
          { type: "common-mistake", text: "Overriding a base method in a subclass to throw std::logic_error / 'not supported'. If Ostrich extends Bird but overrides fly() to throw — you broke LSP. The caller using Bird.fly() gets a surprise. Solution: don't inherit from Bird, or separate a FlyingBird interface from Bird." },
          { type: "interview", qas: [
            { q: "How do you check if a class hierarchy violates LSP?", a: "Substitute the subclass wherever the parent is used. Run all parent class tests against the subclass. If any test fails, LSP is violated. Red flags: subclass overrides a method with an empty body, throws 'not supported', strengthens preconditions, or weakens postconditions." },
            { q: "Real-world LSP violation you've seen?", a: "Common: ReadOnlyList extending a mutable list and overriding add() to throw. Code that receives the list and calls add() will crash. Better design: ReadOnlyList and ArrayList both implement a List interface — a parallel hierarchy with no inheritance between them." },
          ]},
        ],
      },
      {
        id: "isp",
        num: 4,
        title: "ISP — Interface Segregation Principle",
        blocks: [
          { type: "eli5", text: "Don't force a class to implement methods it doesn't need. Several small, focused interfaces beat one giant interface that nobody fully uses." },
          { type: "para", text: "Clients should not be forced to depend on interfaces they don't use. A fat interface forces classes to implement methods irrelevant to them. Split large interfaces into smaller, focused ones." },
          { type: "pre", text: "// FAT INTERFACE — ISP violation\nclass Animal {\npublic:\n    virtual void eat()  = 0;\n    virtual void fly()  = 0;   // Dogs can't fly!\n    virtual void swim() = 0;   // Eagles can't swim well!\n    virtual ~Animal() = default;\n};\n\nclass Dog : public Animal {\npublic:\n    void eat()  override { std::cout << \"woof\"; }\n    void fly()  override { throw std::logic_error(\"can't fly\"); } // Forced to implement!\n    void swim() override { std::cout << \"paddle\"; }\n};\n\n// SEGREGATED INTERFACES\nclass Eater   { public: virtual void eat()  = 0; virtual ~Eater()   = default; };\nclass Flyer   { public: virtual void fly()  = 0; virtual ~Flyer()   = default; };\nclass Swimmer { public: virtual void swim() = 0; virtual ~Swimmer() = default; };\n\nclass Dog2  : public Eater, public Swimmer { /* only what Dog can do */ };\nclass Eagle : public Eater, public Flyer   { /* only what Eagle can do */ };\nclass Duck  : public Eater, public Flyer, public Swimmer { /* ... */ };" },
          { type: "analogy", text: "ISP is like a restaurant menu. A menu for omnivores, vegans, halal, gluten-free, and kids is overwhelming. Separate menus for each — you only read what applies to you. Fat interfaces are that overwhelming single menu." },
          { type: "memory-trick", text: "ISP = 'Pay only for what you use.' If a class has methods it never calls, the interface is too fat. Role interfaces over header interfaces." },
          { type: "interview", qas: [
            { q: "What's the difference between ISP and SRP?", a: "SRP is about classes and their responsibilities (one reason to change). ISP is about interfaces and their clients (only expose what clients need). SRP is the supplier perspective. ISP is the consumer perspective. Both lead to smaller, focused units — just from different angles." },
            { q: "How does ISP apply in REST API design?", a: "API versioning violates ISP when v2 clients must parse v1 response fields they never use. GraphQL is ISP embodied — clients query only the fields they need, not a fat response schema. In REST, resource-specific endpoints (GET /users/profile, GET /users/settings) beat one fat GET /users." },
          ]},
        ],
      },
      {
        id: "dip",
        num: 5,
        title: "DIP — Dependency Inversion Principle",
        blocks: [
          { type: "eli5", text: "High-level code shouldn't hard-wire itself to a specific database or service. Depend on an interface and pass the real thing in from outside — so you can swap it later (like a fake one in tests)." },
          { type: "para", text: "High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions. In practice: depend on interfaces, not concrete classes. Inject dependencies from outside." },
          { type: "pre", text: "// VIOLATES DIP — high-level OrderService directly depends on low-level MySQLRepo\nclass MySQLOrderRepository {\npublic:\n    void save(const Order& o) { /* low-level detail */ }\n};\n\nclass OrderService {                       // high-level policy\n    MySQLOrderRepository repo;              // hard dependency on MySQL!\npublic:\n    void placeOrder(const Order& o) { repo.save(o); }\n};\n\n// FOLLOWS DIP — both depend on an abstraction\nclass OrderRepository {                     // the abstraction\npublic:\n    virtual void save(const Order& o) = 0;\n    virtual ~OrderRepository() = default;\n};\n\nclass MySQLOrderRepository2   : public OrderRepository { /* detail -> abstraction */ };\nclass InMemoryOrderRepository : public OrderRepository { /* easy test double! */ };\n\nclass OrderService2 {                        // depends on abstraction\n    OrderRepository& repo;                    // injected!\npublic:\n    explicit OrderService2(OrderRepository& r) : repo(r) {}\n    void placeOrder(const Order& o) { repo.save(o); }\n};\n\n// Wired in main / composition root:\n//   MySQLOrderRepository2 db;   OrderService2 service(db);\n// In tests:\n//   InMemoryOrderRepository fake; OrderService2 service(fake);" },
          { type: "analogy", text: "Electrical outlets are DIP in action. Your laptop doesn't hardwire into the wall (direct dependency). It uses a plug standard (abstraction). The wall provides power through the same standard. Swap wall socket implementations (US/EU/UK) without changing the laptop." },
          { type: "memory-trick", text: "DIP = 'Program to an interface, not an implementation.' Wherever you write 'new ConcreteClass()' inside another class, ask: should this be injected? If swapping it (for testing or change) would require modifying this class — inject it." },
          { type: "common-mistake", text: "Confusing DIP with DI (Dependency Injection). DI is a technique (passing dependencies from outside). DIP is a principle (both sides depend on abstractions). You can do DI without DIP (inject concrete classes). DIP requires the abstraction layer. Use DI frameworks / composition roots to implement DIP." },
          { type: "interview", qas: [
            { q: "How do you test code that violates DIP?", a: "You can't mock what's hardcoded. Code with `MySQLDb db;` as a member requires a live DB for unit tests. Fix: extract an interface, inject via constructor. Now tests inject a FakeDb with no DB needed. If you're writing integration tests instead of unit tests because mocking is impossible — DIP is violated." },
            { q: "What is the Composition Root?", a: "The single place in an application where all dependencies are wired together — usually main() or application startup. Everything else depends on abstractions. The composition root is the only place that knows about concrete implementations. Keeps dependency knowledge isolated and testable." },
          ]},
        ],
      },
    ],
  },

  "design-patterns-creational": {
    id: "design-patterns-creational",
    title: "Creational Patterns",
    chapters: [
      {
        id: "factory-method",
        num: 1,
        title: "Factory Method",
        blocks: [
          { type: "eli5", text: "Instead of writing `new EmailNotification()` scattered all over your code, ask a factory to build the object for you. Adding a new type later means changing one place, not fifty." },
          { type: "para", text: "Define an interface for creating an object but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses. Useful when the exact type of object to create isn't known until runtime." },
          { type: "pre", text: "#include <memory>\n#include <string>\n#include <unordered_map>\n\nclass Notification {\npublic:\n    virtual void send(const std::string& message) = 0;\n    virtual ~Notification() = default;\n};\n\nclass EmailNotification : public Notification {\npublic: void send(const std::string& m) override { std::cout << \"Email: \" << m; }\n};\nclass SMSNotification : public Notification {\npublic: void send(const std::string& m) override { std::cout << \"SMS: \" << m; }\n};\nclass PushNotification : public Notification {\npublic: void send(const std::string& m) override { std::cout << \"Push: \" << m; }\n};\n\n// Factory Method\nclass NotificationFactory {\npublic:\n    virtual std::unique_ptr<Notification> createNotification() = 0;\n    void notify(const std::string& message) {   // uses factory method\n        auto n = createNotification();\n        n->send(message);\n    }\n    virtual ~NotificationFactory() = default;\n};\n\nclass EmailFactory : public NotificationFactory {\npublic: std::unique_ptr<Notification> createNotification() override {\n            return std::make_unique<EmailNotification>(); }\n};\nclass SMSFactory : public NotificationFactory {\npublic: std::unique_ptr<Notification> createNotification() override {\n            return std::make_unique<SMSNotification>(); }\n};\n\n// SIMPLER: static factory function (80% of real usage)\nstd::unique_ptr<Notification> createNotification(const std::string& type) {\n    if (type == \"email\") return std::make_unique<EmailNotification>();\n    if (type == \"sms\")   return std::make_unique<SMSNotification>();\n    return std::make_unique<PushNotification>();\n}" },
          { type: "memory-trick", text: "Factory Method: 'let subclasses decide.' The parent defines WHAT to do (send notification), the subclass decides HOW to create the tool (which notification type). Real code often simplifies to a static factory function." },
          { type: "interview", qas: [
            { q: "When would you use Factory Method vs Abstract Factory?", a: "Factory Method creates ONE product via subclassing — one creation point. Abstract Factory creates FAMILIES of related products — multiple creation points that must be consistent. Example: Factory Method for creating Notifications. Abstract Factory for creating UI components (Button + TextField + Checkbox) that must all be iOS-style or Android-style together." },
            { q: "What problem does Factory Method solve?", a: "It decouples object creation from object use. Client code works with the Notification interface, doesn't know or care if it's Email/SMS/Push. Adding a new type (Slack notification) doesn't touch client code. Solves OCP — extend via new factory, don't modify existing code." },
          ]},
        ],
      },
      {
        id: "singleton",
        num: 2,
        title: "Singleton",
        blocks: [
          { type: "eli5", text: "Sometimes you want EXACTLY ONE of something in the whole program — one config, one logger, one DB connection. Singleton guarantees only a single instance ever exists." },
          { type: "para", text: "Ensure a class has only one instance and provide a global access point to it. Use for shared resources: config, thread pools, connection pools, logging, caches. The most misused pattern — global state is a test antipattern." },
          { type: "pre", text: "#include <mutex>\n\n// Thread-safe Singleton (C++11 magic-static — simplest correct version)\nclass DatabaseConnection {\npublic:\n    static DatabaseConnection& instance() {\n        static DatabaseConnection inst;   // initialized once, thread-safe since C++11\n        return inst;\n    }\n    void query(const std::string& sql) { /* ... */ }\n\n    DatabaseConnection(const DatabaseConnection&) = delete;\n    DatabaseConnection& operator=(const DatabaseConnection&) = delete;\nprivate:\n    DatabaseConnection() { connect(); }   // expensive, done once\n    void connect() { /* create_db_connection() */ }\n};\n\n// Usage\nauto& db1 = DatabaseConnection::instance();\nauto& db2 = DatabaseConnection::instance();\n// &db1 == &db2  — same instance\n\n// Explicit double-checked locking (pre-C++11 style, shown for the interview)\nclass Db {\n    static Db* inst;\n    static std::mutex mtx;\npublic:\n    static Db* get() {\n        if (!inst) {\n            std::lock_guard<std::mutex> lock(mtx);\n            if (!inst) inst = new Db();   // double-checked\n        }\n        return inst;\n    }\n};" },
          { type: "common-mistake", text: "Singleton makes unit testing hard — you can't easily swap the singleton for a test double. Prefer DI: register as a singleton in a DI container / composition root rather than baking the Singleton pattern into the class. The container manages single-instance semantics; your class stays testable." },
          { type: "memory-trick", text: "Singleton: 'One ring to rule them all.' In C++ prefer the Meyers singleton (function-local static) — thread-safe since C++11, no manual locking. But remember: Singleton = global state = test nightmare. Prefer injected singletons over hand-rolled Singleton classes." },
          { type: "interview", qas: [
            { q: "Why is Singleton considered an anti-pattern by some?", a: "It creates hidden global state, making code hard to test (can't swap the singleton in unit tests), hard to parallelize (shared mutable state), and creates tight coupling. Classes that use a Singleton are implicitly coupled to it. Better: inject as a dependency. Let a composition root ensure single instantiation. Your class remains pure and testable." },
            { q: "How do you implement a thread-safe Singleton in C++?", a: "Use a function-local static (Meyers singleton): `static T inst; return inst;` inside a static instance() method. The C++11 standard guarantees this initialization is thread-safe and happens exactly once, lazily, with no manual locking. Delete the copy constructor and copy-assignment to prevent duplication. Avoid a raw `new` + mutex unless you need explicit control over destruction order." },
          ]},
        ],
      },
      {
        id: "builder",
        num: 3,
        title: "Builder",
        blocks: [
          { type: "eli5", text: "When an object has lots of optional settings, a constructor with 8 arguments is unreadable. Builder lets you set them one at a time, by name: .withCrust('thin').withSauce('pesto').build()." },
          { type: "para", text: "Separate the construction of a complex object from its representation. Use when an object requires many optional parameters, or construction involves multiple steps. Eliminates telescoping constructors." },
          { type: "pre", text: "// PROBLEM: Telescoping constructor\nclass Pizza {\npublic:\n    Pizza(std::string size, bool cheese = false, bool pepperoni = false,\n          bool mushrooms = false, bool extraCheese = false,\n          bool thinCrust = false, std::string sauce = \"tomato\");\n};\n// Pizza p(\"large\", true, false, true, false, true, \"pesto\"); // what does each bool mean?!\n\n// BUILDER SOLUTION\nclass PizzaBuilder;\n\nclass Pizza {\n    std::string size, crust, sauce;\n    std::vector<std::string> toppings;\n    friend class PizzaBuilder;\n    Pizza() = default;\npublic:\n    // getters ...\n};\n\nclass PizzaBuilder {\n    Pizza pizza;\npublic:\n    explicit PizzaBuilder(const std::string& size) {\n        pizza.size = size; pizza.crust = \"thick\"; pizza.sauce = \"tomato\";\n    }\n    PizzaBuilder& addTopping(const std::string& t) { pizza.toppings.push_back(t); return *this; }\n    PizzaBuilder& withCrust(const std::string& c)   { pizza.crust = c; return *this; }\n    PizzaBuilder& withSauce(const std::string& s)   { pizza.sauce = s; return *this; }\n    Pizza build() { /* validate here! */ return pizza; }\n};\n\n// CLEAN: self-documenting method chaining\nPizza pizza = PizzaBuilder(\"large\")\n    .addTopping(\"cheese\")\n    .addTopping(\"mushrooms\")\n    .withCrust(\"thin\")\n    .withSauce(\"pesto\")\n    .build();" },
          { type: "memory-trick", text: "Builder = 'readable step-by-step construction with method chaining.' Key signals you need Builder: more than 4 constructor params, many optional params, params of same type (easy to swap), or construction order matters." },
          { type: "interview", qas: [
            { q: "Where is Builder used in real-world code?", a: "C++: std::stringstream for building strings; fluent config/query builder APIs. Java: StringBuilder, HttpRequest.newBuilder(), Lombok @Builder. SQL query builders (query().filter().orderBy().limit()). Test data factories. Most query/request builder APIs use the Builder pattern." },
            { q: "What validation should happen in build()?", a: "Required fields must be set (throw if missing). Mutually exclusive options (can't have both thin and thick crust). Business rules (size must be S/M/L/XL). build() is the validation point. Individual setter methods can do type checking but build() does cross-field validation. This makes invalid states impossible to create." },
          ]},
        ],
      },
      {
        id: "prototype",
        num: 4,
        title: "Prototype",
        blocks: [
          { type: "eli5", text: "If making an object is slow (loads from a DB, heavy setup), build one good copy once and CLONE it for the rest, instead of constructing each one from scratch." },
          { type: "para", text: "Specify objects to create using a prototypical instance and create new objects by copying this prototype. Use when object creation is expensive (DB lookup, complex computation) and you need many similar objects." },
          { type: "pre", text: "#include <memory>\n\nclass DocumentTemplate {\npublic:\n    std::string title;\n    std::string content;                 // expensive to generate\n    std::shared_ptr<Styles> styles;      // deep object graph\n    std::map<std::string, int> metadata;\n\n    // Polymorphic clone (the Prototype method)\n    virtual std::unique_ptr<DocumentTemplate> clone() const {\n        return std::make_unique<DocumentTemplate>(*this);  // copy ctor\n    }\n    virtual ~DocumentTemplate() = default;\n};\n\n// Create once, clone many times\nDocumentTemplate base;\nbase.title    = \"Report\";\nbase.content  = loadFromDb();   // expensive!\nbase.styles   = loadStyles();\nbase.metadata = {{\"version\", 1}};\n\n// Fast clones — no DB hit\nauto doc1 = base.clone(); doc1->title = \"Q1 Report\";\nauto doc2 = base.clone(); doc2->title = \"Q2 Report\";\n\n// SHALLOW vs DEEP COPY — critical distinction\n// Default copy ctor copies members. A shared_ptr member is SHARED (shallow):\n//   both clones point to the SAME Styles object.\n// For independent nested objects (deep copy), clone the pointee explicitly:\n//   copy.styles = std::make_shared<Styles>(*styles);" },
          { type: "memory-trick", text: "Prototype = 'Clone instead of construct.' When constructing an object is expensive, clone a known-good instance. Deep copy vs shallow copy is the key interview trap — in C++, watch out for pointer/shared_ptr members that get shared instead of duplicated." },
          { type: "interview", qas: [
            { q: "When would you use Prototype over other creational patterns?", a: "When initialization is expensive (DB query, network call, complex computation). When you need many similar objects with minor variations. Game development — cloning enemy templates. Document management — cloning document templates. ORM frameworks — cloning entity objects. Key advantage: avoids repeated expensive initialization." },
            { q: "What's the difference between shallow copy and deep copy?", a: "Shallow copy: new object, but pointer/reference members still point to the same nested objects. Modifying a nested object through the clone modifies the original. Deep copy: new object AND new copies of all nested objects — completely independent. In C++, the default copy constructor is shallow with respect to raw/shared pointers; to deep-copy you must clone the pointees yourself (or give the member type a value-semantics copy)." },
          ]},
        ],
      },
      {
        id: "abstract-factory",
        num: 5,
        title: "Abstract Factory",
        blocks: [
          { type: "eli5", text: "A factory that produces a whole MATCHING SET of things — all Mac-style, or all Windows-style — so you never accidentally mix a Mac button with a Windows text box." },
          { type: "para", text: "Provide an interface for creating families of related or dependent objects without specifying their concrete classes. Ensures that products created together are compatible. Use when your system needs to be independent of how its products are created." },
          { type: "pre", text: "#include <memory>\n\n// PRODUCT interfaces\nclass Button    { public: virtual std::string render() = 0; virtual ~Button() = default; };\nclass TextField { public: virtual std::string render() = 0; virtual ~TextField() = default; };\n\n// FAMILY 1: macOS\nclass MacButton    : public Button    { public: std::string render() override { return \"macOS button\"; } };\nclass MacTextField : public TextField { public: std::string render() override { return \"macOS textfield\"; } };\n// FAMILY 2: Windows\nclass WinButton    : public Button    { public: std::string render() override { return \"Windows button\"; } };\nclass WinTextField : public TextField { public: std::string render() override { return \"Windows textfield\"; } };\n\n// Abstract Factory — creates families\nclass UIFactory {\npublic:\n    virtual std::unique_ptr<Button>    createButton()    = 0;\n    virtual std::unique_ptr<TextField> createTextField() = 0;\n    virtual ~UIFactory() = default;\n};\n\nclass MacUIFactory : public UIFactory {\npublic:\n    std::unique_ptr<Button>    createButton()    override { return std::make_unique<MacButton>(); }\n    std::unique_ptr<TextField> createTextField() override { return std::make_unique<MacTextField>(); }\n};\nclass WinUIFactory : public UIFactory {\npublic:\n    std::unique_ptr<Button>    createButton()    override { return std::make_unique<WinButton>(); }\n    std::unique_ptr<TextField> createTextField() override { return std::make_unique<WinTextField>(); }\n};\n\n// Client only knows UIFactory — independent of platform\nclass Application {\n    std::unique_ptr<Button> button;\n    std::unique_ptr<TextField> field;\npublic:\n    explicit Application(UIFactory& f)\n        : button(f.createButton()), field(f.createTextField()) {}\n        // guaranteed compatible — same factory created them\n};\n\n// Composition root picks the factory\n// MacUIFactory f; Application app(f);  // or WinUIFactory" },
          { type: "memory-trick", text: "Abstract Factory = 'Consistent family guarantee.' Factory Method creates ONE product. Abstract Factory creates a FAMILY of products that belong together. If you switch factories, ALL products switch consistently — no Mac button with a Windows text field." },
          { type: "interview", qas: [
            { q: "Abstract Factory vs Factory Method?", a: "Factory Method: one virtual method, one product, subclassing to vary. Abstract Factory: multiple factory methods grouped in an interface, multiple related products, delegation (not inheritance) to vary. Abstract Factory often uses multiple Factory Methods internally. Use Abstract Factory when you need consistency across multiple related objects." },
            { q: "Real-world Abstract Factory example?", a: "Database access layer: SqlServerFactory creates SqlServerConnection + SqlServerCommand + SqlServerDataAdapter. MySQLFactory creates compatible MySQL equivalents. Swap the factory, the entire DB access layer switches. Another example: a test-doubles factory — creates fake repository + fake email service + fake payment gateway that all work together in tests." },
          ]},
        ],
      },
    ],
  },

  "design-patterns-structural": {
    id: "design-patterns-structural",
    title: "Structural Patterns",
    chapters: [
      {
        id: "adapter",
        num: 1,
        title: "Adapter",
        blocks: [
          { type: "eli5", text: "You have a plug that doesn't fit the socket. An adapter wraps the old thing so it fits the interface your code expects — without changing either side." },
          { type: "para", text: "Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces. The wrapper pattern — wrap old interface, expose new one." },
          { type: "pre", text: "// SCENARIO: Third-party payment library with incompatible interface\nclass LegacyPaymentProcessor {\npublic:\n    void makePayment(int amountCents, const std::string& currencyCode) { /* ... */ }\n};\n\n// YOUR system expects:\nclass PaymentGateway {\npublic:\n    virtual bool charge(double amount, const std::string& currency) = 0;\n    virtual ~PaymentGateway() = default;\n};\n\n// ADAPTER bridges the gap\nclass LegacyPaymentAdapter : public PaymentGateway {\n    LegacyPaymentProcessor& legacy;\npublic:\n    explicit LegacyPaymentAdapter(LegacyPaymentProcessor& l) : legacy(l) {}\n\n    bool charge(double amount, const std::string& currency) override {\n        int amountCents = static_cast<int>(amount * 100);   // adapt: dollars -> cents\n        try {\n            legacy.makePayment(amountCents, currency);\n            return true;\n        } catch (...) {\n            return false;\n        }\n    }\n};\n\n// Client uses PaymentGateway — doesn't know about LegacyPaymentProcessor\nLegacyPaymentProcessor processor;\nLegacyPaymentAdapter gateway(processor);\ngateway.charge(29.99, \"USD\");   // clean interface" },
          { type: "analogy", text: "A travel power adapter converts the socket interface from US (Type A) to EU (Type C). Your laptop charger (client) doesn't change. The wall socket (adaptee) doesn't change. The adapter bridges them." },
          { type: "memory-trick", text: "Adapter = 'make incompatible things work together.' Always involves wrapping an existing class. Object adapter (composition, preferred) vs class adapter (multiple/private inheritance). Use when you can't modify the source." },
          { type: "interview", qas: [
            { q: "When do you use Adapter in real code?", a: "Integrating third-party libraries with incompatible APIs. Legacy code migration — wrap old interface with new one. Testing — create an adapter around external services for easy mocking. Protocol bridging — SOAP to REST adapter. ORMs use adapters internally to bridge objects to SQL." },
            { q: "Adapter vs Decorator?", a: "Adapter changes the interface — same functionality, different method signatures. Decorator preserves the interface — same method signatures, adds behavior. Adapter: LegacyPayment → PaymentGateway. Decorator: PaymentGateway → LoggingPaymentGateway (same interface, adds logging). You can chain Decorators; Adapters are typically one-way bridges." },
          ]},
        ],
      },
      {
        id: "decorator",
        num: 2,
        title: "Decorator",
        blocks: [
          { type: "eli5", text: "Wrap an object to add extra behavior on top, like adding milk, then syrup to coffee. Each layer keeps the same 'shape' (interface) but adds a little more." },
          { type: "para", text: "Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. The interface stays the same — behavior is layered." },
          { type: "pre", text: "#include <memory>\n\nclass Coffee {\npublic:\n    virtual double cost() const = 0;\n    virtual std::string description() const = 0;\n    virtual ~Coffee() = default;\n};\n\nclass SimpleCoffee : public Coffee {\npublic:\n    double cost() const override { return 1.0; }\n    std::string description() const override { return \"Simple coffee\"; }\n};\n\n// Decorator base — SAME interface as Coffee\nclass CoffeeDecorator : public Coffee {\nprotected:\n    std::unique_ptr<Coffee> coffee;   // wraps an existing Coffee\npublic:\n    explicit CoffeeDecorator(std::unique_ptr<Coffee> c) : coffee(std::move(c)) {}\n    double cost() const override { return coffee->cost(); }\n    std::string description() const override { return coffee->description(); }\n};\n\nclass MilkDecorator : public CoffeeDecorator {\npublic:\n    using CoffeeDecorator::CoffeeDecorator;\n    double cost() const override { return coffee->cost() + 0.5; }\n    std::string description() const override { return coffee->description() + \", milk\"; }\n};\nclass SyrupDecorator : public CoffeeDecorator {\npublic:\n    using CoffeeDecorator::CoffeeDecorator;\n    double cost() const override { return coffee->cost() + 0.75; }\n    std::string description() const override { return coffee->description() + \", syrup\"; }\n};\n\n// COMPOSABLE at runtime\nstd::unique_ptr<Coffee> c = std::make_unique<SimpleCoffee>();\nc = std::make_unique<MilkDecorator>(std::move(c));   // add milk\nc = std::make_unique<SyrupDecorator>(std::move(c));  // add syrup\nc = std::make_unique<MilkDecorator>(std::move(c));   // double milk\n// c->cost()        -> 2.75\n// c->description() -> \"Simple coffee, milk, syrup, milk\"" },
          { type: "analogy", text: "Decorator is like wearing clothes. You start with a Person (base). Add a Jacket (decorator) — still a person, just warmer. Add Gloves — still a person, just warmer with covered hands. Each layer adds behavior without changing the underlying object." },
          { type: "memory-trick", text: "Decorator = 'same interface, layered behavior.' Key indicator: when you see classes like LoggingX, CachingX, RetryX, TimedX wrapping the same interface X — that's Decorator. Each layer wraps a pointer to the interface and forwards + adds." },
          { type: "interview", qas: [
            { q: "When would you use Decorator over subclassing?", a: "When combinations explode. CoffeeWithMilk, CoffeeWithSyrup, CoffeeWithMilkAndSyrup, DoubleMilkCoffee... That's 2^n subclasses for n toppings. Decorator composes at runtime — n decorator classes handle all combinations. Also when the base class is from a library you can't modify." },
            { q: "Real-world Decorator examples in frameworks?", a: "Java I/O: InputStream → FileInputStream, decorated with BufferedInputStream, then DataInputStream, then CipherInputStream — each adds behavior (buffering, type-reading, encryption) without subclassing. C++: std::basic_streambuf layering. HTTP client middleware (retry, auth, logging) all use the Decorator pattern." },
          ]},
        ],
      },
      {
        id: "proxy",
        num: 3,
        title: "Proxy",
        blocks: [
          { type: "eli5", text: "A stand-in that sits in front of the real object and controls access to it — for example loading it only when actually needed, or checking permissions first." },
          { type: "para", text: "Provide a surrogate or placeholder for another object to control access to it. Three main variants: Virtual Proxy (lazy loading), Protection Proxy (access control), Remote Proxy (network transparency). All maintain the same interface as the real object." },
          { type: "pre", text: "#include <memory>\n\nclass Image {\npublic:\n    virtual void display() = 0;\n    virtual ~Image() = default;\n};\n\nclass RealImage : public Image {\n    std::string filename;\npublic:\n    explicit RealImage(std::string f) : filename(std::move(f)) { load(); }\n    void load() { std::cout << \"Loading \" << filename << \" from disk...\"; } // heavy!\n    void display() override { std::cout << \"Displaying \" << filename; }\n};\n\n// VIRTUAL PROXY — lazy loading\nclass LazyImageProxy : public Image {\n    std::string filename;\n    std::unique_ptr<RealImage> real;   // not loaded yet\npublic:\n    explicit LazyImageProxy(std::string f) : filename(std::move(f)) {}\n    void display() override {\n        if (!real) real = std::make_unique<RealImage>(filename); // load on first use\n        real->display();\n    }\n};\n\n// PROTECTION PROXY — access control\nclass SecureImageProxy : public Image {\n    Image& real;\n    std::string role;\npublic:\n    SecureImageProxy(Image& r, std::string userRole) : real(r), role(std::move(userRole)) {}\n    void display() override {\n        if (role != \"admin\" && role != \"viewer\")\n            throw std::runtime_error(\"Access denied\");\n        real.display();\n    }\n};" },
          { type: "memory-trick", text: "Proxy = 'stand-in that controls access.' Same interface as real object. Virtual Proxy = lazy init (don't load until needed). Protection Proxy = guard (check permissions). Remote Proxy = hide network call. Caching Proxy = memoize (don't recalculate)." },
          { type: "interview", qas: [
            { q: "How does ORM lazy loading use Proxy?", a: "SQLAlchemy/Hibernate returns a Proxy object instead of the real related entity. Accessing user.orders triggers the proxy to load orders from DB on first access. If you never access user.orders, no DB query. The proxy has the same interface as the real Orders collection. This is Virtual Proxy — delays an expensive DB query until needed." },
            { q: "Proxy vs Decorator?", a: "Both wrap an object with the same interface. Decorator adds behavior the client controls. Proxy controls access the client may not even know about. Proxy is typically transparent (client doesn't know they're using a proxy). Decorator is explicit (client adds layers). Proxy manages lifecycle (lazy loading, caching). Decorator manages behavior (logging, timing)." },
          ]},
        ],
      },
      {
        id: "facade",
        num: 4,
        title: "Facade",
        blocks: [
          { type: "eli5", text: "A big system has many moving parts. A facade is one simple front door: you call a single easy method and it handles all the complicated steps behind the scenes." },
          { type: "para", text: "Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use. Hides complexity behind a simple interface." },
          { type: "pre", text: "// COMPLEX subsystem — many moving parts\nclass VideoDecoder { public: Video decode(const std::string& file); };\nclass AudioDecoder { public: Audio decode(const std::string& file); };\nclass AudioMixer   { public: Audio mix(const std::vector<Audio>& tracks); };\nclass VideoEncoder { public: Data  encode(const Video& v, const std::string& codec); };\nclass FileSaver    { public: void  save(const Data& data, const std::string& path); };\n\n// WITHOUT FACADE — the client must orchestrate everything:\n//   auto video = VideoDecoder().decode(f);\n//   auto audio = AudioDecoder().decode(f);\n//   auto mixed = AudioMixer().mix({audio});\n//   auto enc   = VideoEncoder().encode(video, \"H264\");\n//   FileSaver().save(enc, output);\n\n// FACADE — simple interface hiding complexity\nclass VideoConversionFacade {\n    VideoDecoder videoDecoder;\n    AudioDecoder audioDecoder;\n    AudioMixer   audioMixer;\n    VideoEncoder encoder;\n    FileSaver    saver;\npublic:\n    std::string convert(const std::string& inputPath,\n                        const std::string& outputPath,\n                        const std::string& codec = \"H264\") {\n        auto video  = videoDecoder.decode(inputPath);\n        auto audio  = audioDecoder.decode(inputPath);\n        auto mixed  = audioMixer.mix({audio});\n        auto result = encoder.encode(video, codec);\n        saver.save(result, outputPath);\n        return outputPath;\n    }\n};\n\n// Client uses one simple method\nVideoConversionFacade converter;\nconverter.convert(\"input.avi\", \"output.mp4\");" },
          { type: "memory-trick", text: "Facade = 'simplified entry point into a complex subsystem.' Hotel concierge analogy: you say 'I need dinner reservations and a taxi.' The concierge handles the complexity of calling restaurants, booking taxis — you just make one call. Facade doesn't prevent direct subsystem access, just provides a simpler path." },
          { type: "interview", qas: [
            { q: "Real-world Facade examples?", a: "Libraries themselves are facades: an HTTP client library hides socket/HTTP/connection-pooling complexity. Cloud SDK facades hide REST API calls. An ORM facades hide SQL. Your controller layer is a facade over the service layer. Facade is everywhere — it's how we manage complexity at system boundaries." },
            { q: "When should you NOT use Facade?", a: "When the facade leaks the underlying complexity anyway (just moves complexity, doesn't hide it). When different clients need different subsets of functionality (consider multiple specific facades). When the subsystem needs to evolve independently and the facade becomes a bottleneck. Facade works best when the subsystem is stable and the simplification is real." },
          ]},
        ],
      },
      {
        id: "composite",
        num: 5,
        title: "Composite",
        blocks: [
          { type: "eli5", text: "Treat a single item and a group of items the same way. A file and a folder both answer 'what's your size?' — a folder just asks its children and adds theirs up." },
          { type: "para", text: "Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects (Leaf) and compositions of objects (Composite) uniformly. Use for tree structures: file systems, UI hierarchies, expression trees." },
          { type: "pre", text: "#include <memory>\n#include <vector>\n\nclass FileSystemComponent {\npublic:\n    virtual int  getSize() const = 0;\n    virtual void printStructure(int indent = 0) const = 0;\n    virtual ~FileSystemComponent() = default;\n};\n\n// LEAF — no children\nclass File : public FileSystemComponent {\n    std::string name; int size;\npublic:\n    File(std::string n, int s) : name(std::move(n)), size(s) {}\n    int getSize() const override { return size; }\n    void printStructure(int indent = 0) const override {\n        std::cout << std::string(indent, ' ') << \"[file] \" << name << \" (\" << size << \"B)\\n\";\n    }\n};\n\n// COMPOSITE — has children\nclass Directory : public FileSystemComponent {\n    std::string name;\n    std::vector<std::unique_ptr<FileSystemComponent>> children;\npublic:\n    explicit Directory(std::string n) : name(std::move(n)) {}\n    void add(std::unique_ptr<FileSystemComponent> c) { children.push_back(std::move(c)); }\n\n    int getSize() const override {   // recursive — works for any depth!\n        int total = 0;\n        for (auto& c : children) total += c->getSize();\n        return total;\n    }\n    void printStructure(int indent = 0) const override {\n        std::cout << std::string(indent, ' ') << \"[dir] \" << name << \"/\\n\";\n        for (auto& c : children) c->printStructure(indent + 2);\n    }\n};\n\n// Build tree — mix Files and Directories uniformly\nauto root = std::make_unique<Directory>(\"root\");\nauto docs = std::make_unique<Directory>(\"docs\");\ndocs->add(std::make_unique<File>(\"readme.md\", 1024));\ndocs->add(std::make_unique<File>(\"design.pdf\", 5120));\nroot->add(std::move(docs));\nroot->add(std::make_unique<File>(\"config.json\", 256));\n// root->getSize() -> 6400, computed recursively" },
          { type: "memory-trick", text: "Composite = 'tree where every node speaks the same language.' Leaf and Composite both implement the same interface. Client never checks 'is this a leaf or composite?' — just calls the interface method. Recursion handles the tree naturally." },
          { type: "interview", qas: [
            { q: "Where do you see Composite pattern in UI frameworks?", a: "A UI component tree IS the Composite pattern. A leaf component (Button) and a composite component (Form with multiple inputs) both implement the same interface (render, layout). The framework renders them uniformly — doesn't need to know if a component is a leaf or composite. Layout and painting work recursively on the tree." },
            { q: "What's the key design decision in Composite?", a: "Where to put child management methods (add/remove). Option 1: in the Component interface (uniformity — leaf implements add/remove but throws). Option 2: only in Composite (safety — requires a type check / cast to add children). Modern advice: put them in Composite only, use the type system to enforce. It's a transparency vs safety tradeoff." },
          ]},
        ],
      },
    ],
  },
};

export default lldPart1;
