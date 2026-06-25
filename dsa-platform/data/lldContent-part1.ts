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
          { type: "para", text: "A class should have only one reason to change. Every module, class, or function should be responsible for a single part of the program's functionality. 'Reason to change' = stakeholder or actor whose requirements drive that change." },
          { type: "analogy", text: "A Swiss Army knife is cool as a product but terrible for surgery. A scalpel does one thing and does it perfectly. SRP means every class should be a scalpel, not a Swiss Army knife." },
          { type: "heading", text: "The God Class Anti-Pattern" },
          { type: "para", text: "God classes violate SRP by knowing too much and doing too much. An Order class that handles pricing, tax calculation, persistence, and email notification has five reasons to change. Split by responsibility: Order (data), OrderPricer (pricing), OrderRepository (persistence), OrderNotifier (notifications)." },
          { type: "pre", text: "# VIOLATES SRP\nclass Order:\n    def calculate_price(self): ...\n    def apply_tax(self): ...\n    def save_to_db(self): ...\n    def send_confirmation_email(self): ...\n    def generate_invoice_pdf(self): ...\n\n# FOLLOWS SRP\nclass Order:           # only holds data\n    items: list\n    customer: Customer\n\nclass OrderPricer:     # only pricing logic\n    def calculate(self, order: Order) -> float: ...\n\nclass OrderRepository: # only persistence\n    def save(self, order: Order): ...\n\nclass OrderNotifier:   # only notifications\n    def send_confirmation(self, order: Order): ..." },
          { type: "memory-trick", text: "SRP test: describe what your class does. If the sentence has 'and', it violates SRP. 'This class processes orders AND sends emails AND saves to DB' = 3 classes." },
          { type: "common-mistake", text: "Over-engineering SRP into 1-method classes. SRP is about reasons to change, not about method count. A UserValidator with 5 validation methods is fine — all change for the same reason (validation rules)." },
          { type: "interview", qas: [
            { q: "What is a 'reason to change' in SRP?", a: "A stakeholder or actor whose requirements would force a modification. If Marketing changes pricing rules AND DB Admin changes schema AND DevOps changes logging format — those are three different reasons. Group code so each group of stakeholders touches one class." },
            { q: "How do you detect SRP violation in code review?", a: "Look for: (1) class with 'Manager' or 'Utils' in name — God class smell. (2) imports spanning multiple domains (DB + email + pricing). (3) methods that touch unrelated state. (4) test files that need 5+ mocks. Too many mocks = too many dependencies = too many responsibilities." },
          ]},
        ],
      },
      {
        id: "ocp",
        num: 2,
        title: "OCP — Open/Closed Principle",
        blocks: [
          { type: "para", text: "Software entities should be open for extension but closed for modification. When requirements change, add new code rather than modifying existing tested code. Achieve this through abstraction — depend on interfaces, not concrete classes." },
          { type: "heading", text: "The Shape Example" },
          { type: "pre", text: "# VIOLATES OCP — every new shape requires modifying AreaCalculator\nclass AreaCalculator:\n    def area(self, shape):\n        if isinstance(shape, Circle): return 3.14 * shape.radius**2\n        elif isinstance(shape, Square): return shape.side**2\n        # Adding Triangle requires changing this method\n\n# FOLLOWS OCP — add new shapes without touching AreaCalculator\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\nclass Circle(Shape):\n    def area(self): return 3.14 * self.radius**2\n\nclass Triangle(Shape):  # NEW shape, zero changes to existing code\n    def area(self): return 0.5 * self.base * self.height\n\nclass AreaCalculator:\n    def area(self, shape: Shape): return shape.area()" },
          { type: "analogy", text: "A plugin architecture is OCP in action. Chrome extensions add new browser behavior without touching Chrome's source code. VS Code extensions add new features without modifying the editor. Design your core like an editor — stable, extensible." },
          { type: "memory-trick", text: "OCP = 'Seal the old, open a new room.' Never renovate the old room (closed for modification). Build a new room (open for extension). The building's structure (interfaces) connects them." },
          { type: "interview", qas: [
            { q: "How do you use OCP in a payment processing system?", a: "Define a PaymentProcessor interface with process(amount) method. Implement CreditCardProcessor, PayPalProcessor, CryptoProcessor as separate classes. Adding a new payment method = new class, zero changes to checkout flow. The switch/if-chain in checkout is the OCP violation to eliminate." },
            { q: "Is OCP always achievable? When do you accept modification?", a: "No. OCP is a direction, not a rule. When the abstraction itself is wrong — the interface design was bad — you must modify. Bug fixes modify. Performance optimizations modify. OCP applies to feature additions: new behaviors should extend, not modify. Accept modification when the contract itself needs to change." },
          ]},
        ],
      },
      {
        id: "lsp",
        num: 3,
        title: "LSP — Liskov Substitution Principle",
        blocks: [
          { type: "para", text: "Subtypes must be substitutable for their base types without breaking program correctness. If S is a subtype of T, objects of S can replace objects of T without altering program behavior. It's not just about type compatibility — it's about behavioral compatibility." },
          { type: "heading", text: "The Square-Rectangle Trap" },
          { type: "pre", text: "# CLASSIC LSP VIOLATION\nclass Rectangle:\n    def set_width(self, w): self.width = w\n    def set_height(self, h): self.height = h\n    def area(self): return self.width * self.height\n\nclass Square(Rectangle):  # Mathematically correct, LSP violation!\n    def set_width(self, w): self.width = w; self.height = w  # forces both\n    def set_height(self, h): self.width = h; self.height = h\n\n# This test passes for Rectangle but BREAKS for Square\ndef test_rectangle(r: Rectangle):\n    r.set_width(5)\n    r.set_height(4)\n    assert r.area() == 20  # FAILS for Square (returns 16!)\n\n# FIX: Don't inherit, use composition or separate interfaces\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\nclass Rectangle(Shape): ...\nclass Square(Shape): ...  # Both implement Shape, neither inherits the other" },
          { type: "memory-trick", text: "LSP = 'Is-a is not enough. Behaves-as is required.' A Square IS-A Rectangle mathematically. But Square doesn't BEHAVE-AS Rectangle (changing width also changes height). Use inheritance only when behavioral contract holds." },
          { type: "common-mistake", text: "Throwing NotImplementedError in subclass methods. If Ostrich extends Bird but overrides fly() with raise NotImplementedError — you broke LSP. The caller using Bird.fly() gets a surprise. Solution: don't inherit from Bird, or separate FlyingBird interface from Bird." },
          { type: "interview", qas: [
            { q: "How do you check if a class hierarchy violates LSP?", a: "Substitute the subclass wherever the parent is used. Run all parent class tests against the subclass. If any test fails, LSP is violated. Red flags: subclass overrides a method with an empty body, throws NotImplementedError, strengthens preconditions, or weakens postconditions." },
            { q: "Real-world LSP violation you've seen?", a: "Common: ReadOnlyList extending ArrayList and overriding add() to throw UnsupportedOperationException. Code that receives ArrayList and calls add() will crash. Better design: ReadOnlyList implements List, ArrayList implements List — parallel hierarchy with no inheritance between them." },
          ]},
        ],
      },
      {
        id: "isp",
        num: 4,
        title: "ISP — Interface Segregation Principle",
        blocks: [
          { type: "para", text: "Clients should not be forced to depend on interfaces they don't use. A fat interface forces classes to implement methods irrelevant to them. Split large interfaces into smaller, focused ones." },
          { type: "pre", text: "# FAT INTERFACE — ISP violation\nclass Animal(ABC):\n    @abstractmethod\n    def eat(self): ...\n    @abstractmethod\n    def fly(self): ...  # Dogs can't fly!\n    @abstractmethod\n    def swim(self): ... # Eagles can't swim well!\n\nclass Dog(Animal):\n    def eat(self): print('woof')\n    def fly(self): raise NotImplementedError  # Forced to implement!\n    def swim(self): print('paddle')\n\n# SEGREGATED INTERFACES\nclass Eater(ABC):\n    @abstractmethod\n    def eat(self): ...\n\nclass Flyer(ABC):\n    @abstractmethod\n    def fly(self): ...\n\nclass Swimmer(ABC):\n    @abstractmethod\n    def swim(self): ...\n\nclass Dog(Eater, Swimmer): ...  # Only what Dog can do\nclass Eagle(Eater, Flyer): ...  # Only what Eagle can do\nclass Duck(Eater, Flyer, Swimmer): ..." },
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
          { type: "para", text: "High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions. In practice: depend on interfaces, not concrete classes. Inject dependencies from outside." },
          { type: "pre", text: "# VIOLATES DIP — high-level OrderService directly depends on low-level MySQLRepo\nclass MySQLOrderRepository:\n    def save(self, order): ... # Low-level detail\n\nclass OrderService:  # High-level policy\n    def __init__(self):\n        self.repo = MySQLOrderRepository()  # Hard dependency on MySQL!\n    def place_order(self, order):\n        self.repo.save(order)\n\n# FOLLOWS DIP — both depend on abstraction\nclass OrderRepository(ABC):  # The abstraction\n    @abstractmethod\n    def save(self, order): ...\n\nclass MySQLOrderRepository(OrderRepository): ...  # Detail depends on abstraction\nclass InMemoryOrderRepository(OrderRepository): ... # Easy test double!\n\nclass OrderService:  # High-level policy depends on abstraction\n    def __init__(self, repo: OrderRepository):  # Injected!\n        self.repo = repo\n\n# Wired in main/composition root:\nservice = OrderService(MySQLOrderRepository())\n# In tests:\nservice = OrderService(InMemoryOrderRepository())" },
          { type: "analogy", text: "Electrical outlets are DIP in action. Your laptop doesn't hardwire into the wall (direct dependency). It uses a plug standard (abstraction). The wall provides power through the same standard. Swap wall socket implementations (US/EU/UK) without changing the laptop." },
          { type: "memory-trick", text: "DIP = 'Program to an interface, not an implementation.' Wherever you write 'new ConcreteClass()' inside another class, ask: should this be injected? If swapping it (for testing or change) would require modifying this class — inject it." },
          { type: "common-mistake", text: "Confusing DIP with DI (Dependency Injection). DI is a technique (passing dependencies from outside). DIP is a principle (both sides depend on abstractions). You can do DI without DIP (inject concrete classes). DIP requires the abstraction layer. Use DI frameworks (Spring, FastAPI Depends) to implement DIP." },
          { type: "interview", qas: [
            { q: "How do you test code that violates DIP?", a: "You can't mock what's hardcoded. Code with new MySQLDb() inside requires a live DB for unit tests. Fix: extract interface, inject via constructor. Now tests inject FakeDb with no DB needed. If you're writing integration tests instead of unit tests because mocking is impossible — DIP is violated." },
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
          { type: "para", text: "Define an interface for creating an object but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses. Useful when the exact type of object to create isn't known until runtime." },
          { type: "pre", text: "from abc import ABC, abstractmethod\n\nclass Notification(ABC):\n    @abstractmethod\n    def send(self, message: str): ...\n\nclass EmailNotification(Notification):\n    def send(self, message): print(f'Email: {message}')\n\nclass SMSNotification(Notification):\n    def send(self, message): print(f'SMS: {message}')\n\nclass PushNotification(Notification):\n    def send(self, message): print(f'Push: {message}')\n\n# Factory Method\nclass NotificationFactory(ABC):\n    @abstractmethod\n    def create_notification(self) -> Notification: ...\n    \n    def notify(self, message: str):  # Uses factory method\n        n = self.create_notification()\n        n.send(message)\n\nclass EmailFactory(NotificationFactory):\n    def create_notification(self): return EmailNotification()\n\nclass SMSFactory(NotificationFactory):\n    def create_notification(self): return SMSNotification()\n\n# SIMPLER: static factory function (80% of real usage)\ndef create_notification(type: str) -> Notification:\n    mapping = {'email': EmailNotification, 'sms': SMSNotification, 'push': PushNotification}\n    return mapping[type]()" },
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
          { type: "para", text: "Ensure a class has only one instance and provide a global access point to it. Use for shared resources: config, thread pools, connection pools, logging, caches. The most misused pattern — global state is a test antipattern." },
          { type: "pre", text: "import threading\n\n# Thread-safe Singleton (Python)\nclass DatabaseConnection:\n    _instance = None\n    _lock = threading.Lock()\n\n    def __new__(cls):\n        if cls._instance is None:\n            with cls._lock:\n                if cls._instance is None:  # double-checked locking\n                    cls._instance = super().__new__(cls)\n                    cls._instance._connect()\n        return cls._instance\n\n    def _connect(self):\n        # expensive operation done once\n        self.connection = create_db_connection()\n\n    def query(self, sql): ...\n\n# Usage\ndb1 = DatabaseConnection()\ndb2 = DatabaseConnection()\nassert db1 is db2  # True — same instance\n\n# Pythonic alternative: module-level singleton\n# db.py\n_connection = None\ndef get_db():\n    global _connection\n    if _connection is None:\n        _connection = create_db_connection()\n    return _connection" },
          { type: "common-mistake", text: "Singleton makes unit testing hard — you can't easily swap the singleton for a test double. Prefer DI: register as a singleton in the DI container rather than implementing Singleton pattern in the class itself. The container manages single-instance semantics, your class remains testable." },
          { type: "memory-trick", text: "Singleton: 'One ring to rule them all.' Double-checked locking for thread safety. But remember: Singleton = global state = test nightmare. Prefer DI container singletons over hand-rolled Singleton classes." },
          { type: "interview", qas: [
            { q: "Why is Singleton considered an anti-pattern by some?", a: "It creates hidden global state, making code hard to test (can't swap the singleton in unit tests), hard to parallelize (shared mutable state), and creates tight coupling. Classes that use a Singleton are implicitly coupled to it. Better: inject as a dependency. Let the DI framework ensure single instantiation. Your class remains pure and testable." },
            { q: "How do you implement a thread-safe Singleton in Java?", a: "Use enum Singleton — Java enums are singletons by design, thread-safe, and handle serialization correctly. Alternative: static inner class (Bill Pugh Singleton) — inner class loaded lazily when getInstance() is first called, thread-safe without synchronization. Avoid synchronized getInstance() — it's a performance bottleneck." },
          ]},
        ],
      },
      {
        id: "builder",
        num: 3,
        title: "Builder",
        blocks: [
          { type: "para", text: "Separate the construction of a complex object from its representation. Use when an object requires many optional parameters, or construction involves multiple steps. Eliminates telescoping constructors." },
          { type: "pre", text: "# PROBLEM: Telescoping constructor\nclass Pizza:\n    def __init__(self, size, cheese=False, pepperoni=False,\n                 mushrooms=False, extra_cheese=False,\n                 thin_crust=False, sauce='tomato'):\n        ...\n# p = Pizza('large', True, False, True, False, True, 'pesto')  # what does each bool mean?!\n\n# BUILDER SOLUTION\nclass Pizza:\n    def __init__(self, builder: 'PizzaBuilder'):\n        self.size = builder.size\n        self.toppings = builder.toppings\n        self.crust = builder.crust\n        self.sauce = builder.sauce\n\nclass PizzaBuilder:\n    def __init__(self, size: str):\n        self.size = size\n        self.toppings = []\n        self.crust = 'thick'\n        self.sauce = 'tomato'\n\n    def add_topping(self, t: str) -> 'PizzaBuilder':\n        self.toppings.append(t); return self  # method chaining!\n\n    def with_crust(self, c: str) -> 'PizzaBuilder':\n        self.crust = c; return self\n\n    def with_sauce(self, s: str) -> 'PizzaBuilder':\n        self.sauce = s; return self\n\n    def build(self) -> Pizza:\n        # validate here!\n        return Pizza(self)\n\n# CLEAN: self-documenting\npizza = (PizzaBuilder('large')\n    .add_topping('cheese')\n    .add_topping('mushrooms')\n    .with_crust('thin')\n    .with_sauce('pesto')\n    .build())" },
          { type: "memory-trick", text: "Builder = 'readable step-by-step construction with method chaining.' Key signals you need Builder: more than 4 constructor params, many optional params, params of same type (easy to swap), or construction order matters." },
          { type: "interview", qas: [
            { q: "Where is Builder used in real-world Java/Python code?", a: "Java: StringBuilder, HttpRequest.newBuilder(), Lombok @Builder. Python: SQLAlchemy query builder (session.query().filter().order_by().limit()). JavaScript: jQuery chains. Test data factories in tests. Most query/request builder APIs use Builder pattern." },
            { q: "What validation should happen in build()?", a: "Required fields must be set (throw if missing). Mutually exclusive options (can't have both thin and thick crust). Business rules (size must be S/M/L/XL). build() is the validation point. Individual setter methods can do type checking but build() does cross-field validation. This makes invalid states impossible to create." },
          ]},
        ],
      },
      {
        id: "prototype",
        num: 4,
        title: "Prototype",
        blocks: [
          { type: "para", text: "Specify objects to create using a prototypical instance and create new objects by copying this prototype. Use when object creation is expensive (DB lookup, complex computation) and you need many similar objects." },
          { type: "pre", text: "import copy\n\nclass DocumentTemplate:\n    def __init__(self, title, content, styles, metadata):\n        self.title = title\n        self.content = content      # expensive to generate\n        self.styles = styles         # deep object graph\n        self.metadata = metadata\n\n    def clone(self) -> 'DocumentTemplate':\n        return copy.deepcopy(self)  # Python built-in deep copy\n\n# Create once, clone many times\nbase_template = DocumentTemplate(\n    title='Report',\n    content=load_from_db(),  # expensive!\n    styles=load_styles(),\n    metadata={'version': 1}\n)\n\n# Fast clones — no DB hit\ndoc1 = base_template.clone()\ndoc1.title = 'Q1 Report'\n\ndoc2 = base_template.clone()\ndoc2.title = 'Q2 Report'\n\n# SHALLOW vs DEEP COPY — critical distinction\nshallow = copy.copy(base_template)  # nested objects SHARED\ndeep = copy.deepcopy(base_template) # nested objects INDEPENDENT" },
          { type: "memory-trick", text: "Prototype = 'Clone instead of construct.' When new Object() is expensive, clone a known-good instance. Deep copy vs shallow copy is the key interview trap — know which you need." },
          { type: "interview", qas: [
            { q: "When would you use Prototype over other creational patterns?", a: "When initialization is expensive (DB query, network call, complex computation). When you need many similar objects with minor variations. Game development — cloning enemy templates. Document management — cloning document templates. ORM frameworks — cloning entity objects. Key advantage: avoids repeated expensive initialization." },
            { q: "What's the difference between shallow copy and deep copy?", a: "Shallow copy: new object, same references for nested objects. Modifying nested object in clone modifies original. Deep copy: new object AND new copies of all nested objects. Completely independent. Prototype pattern needs deep copy if modifications to clone shouldn't affect original. Python: copy.copy() vs copy.deepcopy(). Java: implement clone() carefully or use serialization." },
          ]},
        ],
      },
      {
        id: "abstract-factory",
        num: 5,
        title: "Abstract Factory",
        blocks: [
          { type: "para", text: "Provide an interface for creating families of related or dependent objects without specifying their concrete classes. Ensures that products created together are compatible. Use when your system needs to be independent of how its products are created." },
          { type: "pre", text: "from abc import ABC, abstractmethod\n\n# FAMILY 1: macOS UI components\nclass MacButton:\n    def render(self): return 'macOS button'\n\nclass MacTextField:\n    def render(self): return 'macOS textfield'\n\n# FAMILY 2: Windows UI components\nclass WindowsButton:\n    def render(self): return 'Windows button'\n\nclass WindowsTextField:\n    def render(self): return 'Windows textfield'\n\n# Abstract Factory — creates families\nclass UIFactory(ABC):\n    @abstractmethod\n    def create_button(self): ...\n    @abstractmethod\n    def create_text_field(self): ...\n\nclass MacUIFactory(UIFactory):\n    def create_button(self): return MacButton()\n    def create_text_field(self): return MacTextField()\n\nclass WindowsUIFactory(UIFactory):\n    def create_button(self): return WindowsButton()\n    def create_text_field(self): return WindowsTextField()\n\n# Client only knows UIFactory — independent of platform\nclass Application:\n    def __init__(self, factory: UIFactory):\n        self.button = factory.create_button()\n        self.text_field = factory.create_text_field()\n        # Guaranteed compatible — same factory created them\n\n# Composition root picks the factory\nif platform == 'mac':\n    app = Application(MacUIFactory())\nelse:\n    app = Application(WindowsUIFactory())" },
          { type: "memory-trick", text: "Abstract Factory = 'Consistent family guarantee.' Factory Method creates ONE product. Abstract Factory creates a FAMILY of products that belong together. If you switch factories, ALL products switch consistently — no Mac button with Windows text field." },
          { type: "interview", qas: [
            { q: "Abstract Factory vs Factory Method?", a: "Factory Method: one virtual method, one product, subclassing to vary. Abstract Factory: multiple factory methods grouped in an interface, multiple related products, delegation (not inheritance) to vary. Abstract Factory often uses multiple Factory Methods internally. Use Abstract Factory when you need consistency across multiple related objects." },
            { q: "Real-world Abstract Factory example?", a: "Database access layer: SqlServerFactory creates SqlServerConnection + SqlServerCommand + SqlServerDataAdapter. MySQLFactory creates compatible MySQL equivalents. Swap factory, entire DB access layer switches. Another example: test doubles factory — creates fake repository + fake email service + fake payment gateway that all work together in tests." },
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
          { type: "para", text: "Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces. The wrapper pattern — wrap old interface, expose new one." },
          { type: "pre", text: "# SCENARIO: Third-party payment library with incompatible interface\nclass LegacyPaymentProcessor:\n    def make_payment(self, amount_cents: int, currency_code: str): ...\n\n# YOUR system expects:\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def charge(self, amount: float, currency: str) -> bool: ...\n\n# ADAPTER bridges the gap\nclass LegacyPaymentAdapter(PaymentGateway):\n    def __init__(self, legacy: LegacyPaymentProcessor):\n        self.legacy = legacy\n\n    def charge(self, amount: float, currency: str) -> bool:\n        # Adapt: float dollars -> int cents\n        amount_cents = int(amount * 100)\n        try:\n            self.legacy.make_payment(amount_cents, currency)\n            return True\n        except Exception:\n            return False\n\n# Client uses PaymentGateway interface — doesn't know about LegacyPaymentProcessor\ngateway = LegacyPaymentAdapter(LegacyPaymentProcessor())\ngateway.charge(29.99, 'USD')  # Clean interface" },
          { type: "analogy", text: "A travel power adapter converts the socket interface from US (Type A) to EU (Type C). Your laptop charger (client) doesn't change. The wall socket (adaptee) doesn't change. The adapter bridges them." },
          { type: "memory-trick", text: "Adapter = 'make incompatible things work together.' Always involves wrapping an existing class. Object adapter (composition, preferred) vs Class adapter (multiple inheritance, avoid in Python/Java). Use when you can't modify the source." },
          { type: "interview", qas: [
            { q: "When do you use Adapter in real code?", a: "Integrating third-party libraries with incompatible APIs. Legacy code migration — wrap old interface with new one. Testing — create an adapter around external services for easy mocking. Protocol bridging — SOAP to REST adapter. ORMs use adapters internally to bridge Python objects to SQL." },
            { q: "Adapter vs Decorator?", a: "Adapter changes the interface — same functionality, different method signatures. Decorator preserves the interface — same method signatures, adds behavior. Adapter: LegacyPayment → PaymentGateway. Decorator: PaymentGateway → LoggingPaymentGateway (same interface, adds logging). You can chain Decorators; Adapters are typically one-way bridges." },
          ]},
        ],
      },
      {
        id: "decorator",
        num: 2,
        title: "Decorator",
        blocks: [
          { type: "para", text: "Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. The interface stays the same — behavior is layered." },
          { type: "pre", text: "from abc import ABC, abstractmethod\n\nclass Coffee(ABC):\n    @abstractmethod\n    def cost(self) -> float: ...\n    @abstractmethod\n    def description(self) -> str: ...\n\nclass SimpleCoffee(Coffee):\n    def cost(self): return 1.0\n    def description(self): return 'Simple coffee'\n\n# Decorator base — SAME interface as Coffee\nclass CoffeeDecorator(Coffee):\n    def __init__(self, coffee: Coffee):\n        self._coffee = coffee  # wraps existing Coffee\n    def cost(self): return self._coffee.cost()\n    def description(self): return self._coffee.description()\n\nclass MilkDecorator(CoffeeDecorator):\n    def cost(self): return self._coffee.cost() + 0.5\n    def description(self): return self._coffee.description() + ', milk'\n\nclass SyrupDecorator(CoffeeDecorator):\n    def cost(self): return self._coffee.cost() + 0.75\n    def description(self): return self._coffee.description() + ', syrup'\n\n# COMPOSABLE at runtime\ncoffee = SimpleCoffee()\ncoffee = MilkDecorator(coffee)       # add milk\ncoffee = SyrupDecorator(coffee)      # add syrup\ncoffee = MilkDecorator(coffee)       # double milk\nprint(coffee.cost())         # 2.75\nprint(coffee.description())  # Simple coffee, milk, syrup, milk" },
          { type: "analogy", text: "Decorator is like wearing clothes. You start with a Person (base). Add a Jacket (decorator) — still a person, just warmer. Add Gloves — still a person, just warmer with covered hands. Each layer adds behavior without changing the underlying object." },
          { type: "memory-trick", text: "Decorator = 'same interface, layered behavior.' Key indicator: when you see classes like LoggingX, CachingX, RetryX, TimedX wrapping the same interface X — that's Decorator. Python has @decorator syntax, but the pattern predates it." },
          { type: "interview", qas: [
            { q: "When would you use Decorator over subclassing?", a: "When combinations explode. CoffeeWithMilk, CoffeeWithSyrup, CoffeeWithMilkAndSyrup, DoubleMilkCoffee... That's 2^n subclasses for n toppings. Decorator composes at runtime — n decorator classes handle all combinations. Also when the base class is from a library you can't modify." },
            { q: "Real-world Decorator examples in frameworks?", a: "Java I/O: InputStream → FileInputStream. Decorate with BufferedInputStream, then DataInputStream, then CipherInputStream. Each adds behavior (buffering, type-reading, encryption) without subclassing. Python's functools.wraps. Django middleware pipeline. HTTP client middleware (retry, auth, logging) all use Decorator pattern." },
          ]},
        ],
      },
      {
        id: "proxy",
        num: 3,
        title: "Proxy",
        blocks: [
          { type: "para", text: "Provide a surrogate or placeholder for another object to control access to it. Three main variants: Virtual Proxy (lazy loading), Protection Proxy (access control), Remote Proxy (network transparency). All maintain the same interface as the real object." },
          { type: "pre", text: "from abc import ABC, abstractmethod\n\nclass Image(ABC):\n    @abstractmethod\n    def display(self): ...\n\nclass RealImage(Image):\n    def __init__(self, filename: str):\n        self.filename = filename\n        self._load()  # expensive!\n\n    def _load(self):\n        print(f'Loading {self.filename} from disk...')  # heavy operation\n        # self.data = read_file(filename)\n\n    def display(self):\n        print(f'Displaying {self.filename}')\n\n# VIRTUAL PROXY — lazy loading\nclass LazyImageProxy(Image):\n    def __init__(self, filename: str):\n        self.filename = filename\n        self._real_image = None  # not loaded yet!\n\n    def display(self):\n        if self._real_image is None:\n            self._real_image = RealImage(self.filename)  # load on first use\n        self._real_image.display()\n\n# PROTECTION PROXY — access control\nclass SecureImageProxy(Image):\n    def __init__(self, real: Image, user_role: str):\n        self._real = real\n        self._role = user_role\n\n    def display(self):\n        if self._role not in ('admin', 'viewer'):\n            raise PermissionError('Access denied')\n        self._real.display()" },
          { type: "memory-trick", text: "Proxy = 'stand-in that controls access.' Same interface as real object. Virtual Proxy = lazy init (don't load until needed). Protection Proxy = guard (check permissions). Remote Proxy = hide network call. Caching Proxy = memoize (don't recalculate)." },
          { type: "interview", qas: [
            { q: "How does ORM lazy loading use Proxy?", a: "SQLAlchemy/Hibernate returns a Proxy object instead of the real related entity. Accessing user.orders triggers the proxy to load orders from DB on first access. If you never access user.orders, no DB query. The proxy has the same interface as the real Orders collection. This is Virtual Proxy — delays expensive DB query until needed." },
            { q: "Proxy vs Decorator?", a: "Both wrap an object with the same interface. Decorator adds behavior the client controls. Proxy controls access the client may not even know about. Proxy is typically transparent (client doesn't know they're using a proxy). Decorator is explicit (client adds layers). Proxy manages lifecycle (lazy loading, caching). Decorator manages behavior (logging, timing)." },
          ]},
        ],
      },
      {
        id: "facade",
        num: 4,
        title: "Facade",
        blocks: [
          { type: "para", text: "Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use. Hides complexity behind a simple interface." },
          { type: "pre", text: "# COMPLEX subsystem — many moving parts\nclass VideoDecoder:\n    def decode(self, file): ...\n\nclass AudioDecoder:\n    def decode(self, file): ...\n\nclass AudioMixer:\n    def mix(self, tracks): ...\n\nclass VideoEncoder:\n    def encode(self, video, codec): ...\n\nclass FileSaver:\n    def save(self, data, path): ...\n\n# WITHOUT FACADE — client must orchestrate everything\n# video = VideoDecoder().decode(f)\n# audio = AudioDecoder().decode(f)\n# mixed = AudioMixer().mix([audio])\n# encoded = VideoEncoder().encode(video, 'H264')\n# FileSaver().save(encoded, output)\n\n# FACADE — simple interface hiding complexity\nclass VideoConversionFacade:\n    def __init__(self):\n        self.video_decoder = VideoDecoder()\n        self.audio_decoder = AudioDecoder()\n        self.audio_mixer = AudioMixer()\n        self.encoder = VideoEncoder()\n        self.saver = FileSaver()\n\n    def convert(self, input_path: str, output_path: str, codec='H264'):\n        video = self.video_decoder.decode(input_path)\n        audio = self.audio_decoder.decode(input_path)\n        mixed = self.audio_mixer.mix([audio])\n        result = self.encoder.encode(video, codec)\n        self.saver.save(result, output_path)\n        return output_path\n\n# Client uses one simple method\nconverter = VideoConversionFacade()\nconverter.convert('input.avi', 'output.mp4')" },
          { type: "memory-trick", text: "Facade = 'simplified entry point into a complex subsystem.' Hotel concierge analogy: you say 'I need dinner reservations and a taxi.' The concierge handles the complexity of calling restaurants, booking taxis — you just make one call. Facade doesn't prevent direct subsystem access, just provides a simpler path." },
          { type: "interview", qas: [
            { q: "Real-world Facade examples?", a: "Libraries themselves are facades: requests library hides socket/HTTP/connection-pooling complexity. AWS SDK facades hide REST API calls. Django ORM facades hide SQL. Your controller layer is a facade over service layer. Facade is everywhere — it's how we manage complexity at system boundaries." },
            { q: "When should you NOT use Facade?", a: "When the facade leaks the underlying complexity anyway (just moves complexity, doesn't hide it). When different clients need different subsets of functionality (consider multiple specific facades). When the subsystem needs to evolve independently and the facade becomes a bottleneck. Facade works best when the subsystem is stable and the simplification is real." },
          ]},
        ],
      },
      {
        id: "composite",
        num: 5,
        title: "Composite",
        blocks: [
          { type: "para", text: "Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects (Leaf) and compositions of objects (Composite) uniformly. Use for tree structures: file systems, UI hierarchies, expression trees." },
          { type: "pre", text: "from abc import ABC, abstractmethod\nfrom typing import List\n\nclass FileSystemComponent(ABC):\n    @abstractmethod\n    def get_size(self) -> int: ...\n    @abstractmethod\n    def print_structure(self, indent=0): ...\n\n# LEAF — no children\nclass File(FileSystemComponent):\n    def __init__(self, name: str, size: int):\n        self.name = name\n        self.size = size\n\n    def get_size(self): return self.size\n    def print_structure(self, indent=0):\n        print(' ' * indent + f'📄 {self.name} ({self.size}B)')\n\n# COMPOSITE — has children\nclass Directory(FileSystemComponent):\n    def __init__(self, name: str):\n        self.name = name\n        self.children: List[FileSystemComponent] = []\n\n    def add(self, component: FileSystemComponent):\n        self.children.append(component)\n\n    def get_size(self):  # recursive — works for any depth!\n        return sum(c.get_size() for c in self.children)\n\n    def print_structure(self, indent=0):\n        print(' ' * indent + f'📁 {self.name}/')\n        for child in self.children:\n            child.print_structure(indent + 2)\n\n# Build tree — mix Files and Directories uniformly\nroot = Directory('root')\ndocs = Directory('docs')\ndocs.add(File('readme.md', 1024))\ndocs.add(File('design.pdf', 5120))\nroot.add(docs)\nroot.add(File('config.json', 256))\nprint(root.get_size())  # 6400 — works recursively" },
          { type: "memory-trick", text: "Composite = 'tree where every node speaks the same language.' Leaf and Composite both implement the same interface. Client never checks 'is this a leaf or composite?' — just calls the interface method. Recursion handles the tree naturally." },
          { type: "interview", qas: [
            { q: "Where do you see Composite pattern in React?", a: "React component tree IS the Composite pattern. A leaf component (Button) and a composite component (Form with multiple inputs) both implement the same interface (render, props). React renders them uniformly — doesn't need to know if a component is a leaf or composite. Virtual DOM diffing works recursively on the tree." },
            { q: "What's the key design decision in Composite?", a: "Where to put child management methods (add/remove). Option 1: in Component interface (uniformity — leaf implements add/remove but throws). Option 2: only in Composite (safety — requires type checking to add children). Modern advice: put in Composite only, use type system to enforce. Transparency vs safety tradeoff." },
          ]},
        ],
      },
    ],
  },
};

export default lldPart1;
